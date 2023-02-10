import { getFrontendOptions, getBackendOptionForProcessing } from "./config.js";
import tar from "tar";
import { promisify } from "util";
import stream from "node:stream";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";
import { getPackageManagerCommand, getShouldAutoStartFromArgs } from "./userArgumentUtils.js";
import { Logger } from "./logger.js";
import chalk from "chalk";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
const pipeline = promisify(stream.pipeline);
const defaultSetupErrorString = "Project Setup Failed!";
function normaliseLocationPath(path) {
    if (path.startsWith("/")) {
        return path.slice(1);
    }
    return path;
}
export async function getDownloadLocationFromAnswers(answers, userArguments) {
    const branchToUse = userArguments.branch || "master";
    // const downloadURL = `https://codeload.github.com/supertokens/create-supertokens-app/tar.gz/${branchToUse}`;
    const downloadURL = `https://github.com/supertokens/create-supertokens-app/archive/${branchToUse}.tar.gz`;
    const selectedFrontend = (await getFrontendOptions(userArguments)).find((element) => {
        return element.value === answers.frontend;
    });
    const selectedBackend = (await getBackendOptionForProcessing(userArguments)).find((element) => {
        return element.value === answers.backend;
    });
    if (selectedFrontend !== undefined && selectedFrontend.isFullStack === true) {
        return {
            frontend: normaliseLocationPath(selectedFrontend.location.main),
            backend: normaliseLocationPath(selectedFrontend.location.main),
            download: downloadURL,
        };
    }
    // Locations are only undefined for recipe options so in this case you never expect them to be undefined
    if (selectedFrontend !== undefined && selectedBackend !== undefined) {
        return {
            frontend: normaliseLocationPath(selectedFrontend.location.main),
            backend: normaliseLocationPath(selectedBackend.location.main),
            download: downloadURL,
        };
    }
    return undefined;
}
export async function downloadApp(locations, folderName) {
    // create the directory if it doesnt already exist
    const __dirname = path.resolve();
    const projectDirectory = __dirname + `/${folderName}`;
    // If the folder already exists, we show an error
    if (fs.existsSync(projectDirectory)) {
        throw new Error(`A folder with name "${folderName}" already exists`);
    }
    // Create the directory to download the boilerplate
    fs.mkdirSync(projectDirectory);
    const isFullStack = locations.frontend === locations.backend;
    const downloadResponse = await fetch(locations.download);
    if (!downloadResponse.ok || downloadResponse.body === null) {
        throw new Error("Failed to download project");
    }
    await pipeline(
        downloadResponse.body,
        tar.extract(
            {
                cwd: `./${folderName}`,
                strip: isFullStack ? 4 : 3,
                strict: true,
                filter: (path, _) => {
                    if (path.includes(locations.frontend)) {
                        return true;
                    }
                    if (path.includes(locations.backend)) {
                        return true;
                    }
                    return false;
                },
            },
            []
        )
    );
}
function getPackageJsonString(input) {
    const frontendStartScript = input.runScripts.frontend.join(" && ");
    const backendStartScript = input.runScripts.backend.join(" && ");
    return `
    {
        "name": "${input.appname}",
        "version": "0.0.1",
        "description": "",
        "main": "index.js",
        "scripts": {
            "start:frontend": "cd frontend && ${frontendStartScript}",
            "start:backend": "cd backend && ${backendStartScript}",
            "start": "npm-run-all --parallel start:frontend start:backend"
        },
        "keywords": [],
        "author": "",
        "license": "ISC",
        "dependencies": {
            "npm-run-all": "^4.1.5"
        }
    }
    `;
}
async function performAdditionalSetupForFrontendIfNeeded(selectedFrontend, folderName, userArguments) {
    /**
     * For all frontends we check if supertokens-web-js has been installed correctly and manually
     * install it if it is missing. This is because old versions of npm sometimes does not install
     * peer dependencies when running `npm install`
     */
    const sourceFolder = selectedFrontend.value !== "next" ? `${folderName}/frontend` : `${folderName}`;
    // If this is false then the project does not use the react SDK
    const doesUseAuthReact = fs.existsSync(`${sourceFolder}/node_modules/supertokens-auth-react`);
    const doesWebJsExist = () => {
        const doesExistInNodeModules = fs.existsSync(`${sourceFolder}/node_modules/supertokens-web-js`);
        const doesExistInAuthReact = fs.existsSync(
            `${sourceFolder}/node_modules/supertokens-auth-react/node_modules/supertokens-web-js`
        );
        return doesExistInAuthReact || doesExistInNodeModules;
    };
    // We only check for web-js being present if the project uses the auth react SDK
    if (doesUseAuthReact && !doesWebJsExist()) {
        const installPrefix = userArguments.manager === "yarn" ? "yarn add" : "npm i";
        let result = await new Promise((res) => {
            let stderr = [];
            const additionalSetup = exec(`cd ${sourceFolder} && ${installPrefix} supertokens-web-js`);
            additionalSetup.on("exit", (code) => {
                const errorString = stderr.join("\n");
                res({
                    code,
                    error: errorString.length === 0 ? undefined : errorString,
                });
            });
            additionalSetup.stderr?.on("data", (data) => {
                // Record any messages printed as errors
                stderr.push(data.toString());
            });
            additionalSetup.stdout?.on("data", (data) => {
                /**
                 * Record any messages printed as errors, we do this for stdout
                 * as well because some scripts use the output stream for errors
                 * too (npm for example) while others use stderr only
                 *
                 * This means that we will output everything if the script exits with
                 * non zero
                 */
                stderr.push(data.toString());
            });
        });
        if (result.code !== 0) {
            const error = result.error !== undefined ? result.error : defaultSetupErrorString;
            throw new Error(error);
        }
    }
}
async function setupFrontendBackendApp(answers, folderName, locations, userArguments, spinner) {
    const frontendFolderName = locations.frontend
        .split("/")
        .filter((i) => i !== "frontend")
        .join("");
    const backendFolderName = locations.backend
        .split("/")
        .filter((i) => i !== "backend")
        .join("");
    const __dirname = path.resolve();
    const frontendDirectory = __dirname + `/${folderName}/${frontendFolderName}`;
    const backendDirectory = __dirname + `/${folderName}/${backendFolderName}`;
    // Rename the folders to frontend and backend
    fs.renameSync(frontendDirectory, __dirname + `/${folderName}/frontend`);
    fs.renameSync(backendDirectory, __dirname + `/${folderName}/backend`);
    const selectedFrontend = (await getFrontendOptions(userArguments)).find((element) => {
        return element.value === answers.frontend;
    });
    const selectedBackend = (await getBackendOptionForProcessing(userArguments)).find((element) => {
        return element.value === answers.backend;
    });
    if (
        selectedFrontend === undefined ||
        selectedBackend === undefined ||
        selectedFrontend.isFullStack === true ||
        selectedBackend.isFullStack === true
    ) {
        throw new Error("Should never come here");
    }
    if (selectedFrontend.location === undefined) {
        throw new Error("Should never come here");
    }
    spinner.text = "Configuring files";
    // Move the recipe config file for the frontend folder to the correct place
    const frontendFiles = fs.readdirSync(
        `./${folderName}/frontend/${normaliseLocationPath(selectedFrontend.location.configFiles)}`
    );
    const frontendRecipeConfig = frontendFiles.filter((i) => i.includes(answers.recipe));
    if (frontendRecipeConfig.length === 0) {
        throw new Error("Should never come here");
    }
    fs.copyFileSync(
        `${folderName}/frontend/${normaliseLocationPath(selectedFrontend.location.configFiles)}/${
            frontendRecipeConfig[0]
        }`,
        `${folderName}/frontend/${normaliseLocationPath(selectedFrontend.location.finalConfig)}`
    );
    // Remove the configs folder
    fs.rmSync(`${folderName}/frontend/${normaliseLocationPath(selectedFrontend.location.configFiles)}`, {
        recursive: true,
        force: true,
    });
    if (selectedBackend.location === undefined) {
        throw new Error("Should not come here");
    }
    const backendFiles = fs.readdirSync(
        `./${folderName}/backend/${normaliseLocationPath(selectedBackend.location.configFiles)}`
    );
    const backendRecipeConfig = backendFiles.filter((i) => i.includes(answers.recipe));
    if (backendRecipeConfig.length === 0) {
        throw new Error("Should never come here");
    }
    fs.copyFileSync(
        `${folderName}/backend/${normaliseLocationPath(selectedBackend.location.configFiles)}/${
            backendRecipeConfig[0]
        }`,
        `${folderName}/backend/${normaliseLocationPath(selectedBackend.location.finalConfig)}`
    );
    // Remove the configs folder
    fs.rmSync(`${folderName}/backend/${normaliseLocationPath(selectedBackend.location.configFiles)}`, {
        recursive: true,
        force: true,
    });
    spinner.text = "Installing frontend dependencies";
    const frontendSetup = new Promise((res) => {
        let stderr = [];
        if (selectedFrontend.script === undefined || selectedFrontend.script.setup.length === 0) {
            res({
                code: 0,
                error: undefined,
            });
            return;
        }
        const setupString = selectedFrontend.script.setup.join(" && ");
        const setup = exec(`cd ${folderName}/frontend && ${setupString}`);
        setup.on("exit", (code) => {
            const errorString = stderr.join("\n");
            res({
                code,
                error: errorString.length === 0 ? undefined : errorString,
            });
        });
        setup.stderr?.on("data", (data) => {
            // Record any messages printed as errors
            stderr.push(data.toString());
        });
        setup.stdout?.on("data", (data) => {
            /**
             * Record any messages printed as errors, we do this for stdout
             * as well because some scripts use the output stream for errors
             * too (npm for example) while others use stderr only
             *
             * This means that we will output everything if the script exits with
             * non zero
             */
            stderr.push(data.toString());
        });
    });
    const frontendSetupResult = await frontendSetup;
    if (frontendSetupResult.code !== 0) {
        const error = frontendSetupResult.error !== undefined ? frontendSetupResult.error : defaultSetupErrorString;
        throw new Error(error);
    }
    await performAdditionalSetupForFrontendIfNeeded(selectedFrontend, folderName, userArguments);
    spinner.text = "Installing backend dependencies";
    const backendSetup = new Promise((res) => {
        let stderr = [];
        if (selectedBackend.script === undefined || selectedBackend.script.setup.length === 0) {
            res({
                code: 0,
                error: undefined,
            });
            return;
        }
        const setupString = selectedBackend.script.setup.join(" && ");
        const setup = exec(`cd ${folderName}/backend && ${setupString}`);
        setup.on("exit", (code) => {
            const errorString = stderr.join("\n");
            res({
                code,
                error: errorString.length === 0 ? undefined : errorString,
            });
        });
        setup.stderr?.on("data", (data) => {
            // Record any messages printed as errors
            stderr.push(data.toString());
        });
        setup.stdout?.on("data", (data) => {
            /**
             * Record any messages printed as errors, we do this for stdout
             * as well because some scripts use the output stream for errors
             * too (npm for example) while others use stderr only
             *
             * This means that we will output everything if the script exits with
             * non zero
             */
            stderr.push(data.toString());
        });
    });
    // Call the frontend and backend setup scripts
    const backendSetupResult = await backendSetup;
    if (backendSetupResult.code !== 0) {
        const error = backendSetupResult.error !== undefined ? backendSetupResult.error : defaultSetupErrorString;
        throw new Error(error);
    }
    // Create a root level package.json file
    fs.writeFileSync(
        `${folderName}/package.json`,
        getPackageJsonString({
            appname: answers.appname,
            runScripts: {
                frontend: selectedFrontend?.script?.run || [],
                backend: selectedBackend?.script?.run || [],
            },
        })
    );
    const rootSetup = new Promise((res) => {
        const rootInstall = exec(`cd ${folderName}/ && npm install`);
        let stderr = [];
        rootInstall.on("exit", (code) => {
            const errorString = stderr.join("\n");
            res({
                code,
                error: errorString.length === 0 ? undefined : errorString,
            });
        });
        rootInstall.stderr?.on("data", (data) => {
            // Record any messages printed as errors
            stderr.push(data.toString());
        });
        rootInstall.stdout?.on("data", (data) => {
            /**
             * Record any messages printed as errors, we do this for stdout
             * as well because some scripts use the output stream for errors
             * too (npm for example) while others use stderr only
             *
             * This means that we will output everything if the script exits with
             * non zero
             */
            stderr.push(data.toString());
        });
    });
    const rootSetupResult = await rootSetup;
    if (rootSetupResult.code !== 0) {
        const error = rootSetupResult.error !== undefined ? rootSetupResult.error : defaultSetupErrorString;
        throw new Error(error);
    }
}
async function setupFullstack(answers, folderName, userArguments, spinner) {
    const selectedFullStack = (await getFrontendOptions(userArguments)).find((element) => {
        return element.value === answers.frontend;
    });
    if (selectedFullStack === undefined || selectedFullStack.isFullStack !== true) {
        throw new Error("Should never come here");
    }
    spinner.text = "Configuring files";
    // Move the recipe config file for the frontend folder to the correct place
    const frontendFiles = fs.readdirSync(
        `./${folderName}/${normaliseLocationPath(selectedFullStack.location.config.frontend.configFiles)}`
    );
    const frontendRecipeConfig = frontendFiles.filter((i) => i.includes(answers.recipe));
    if (frontendRecipeConfig.length === 0) {
        throw new Error("Should never come here");
    }
    fs.copyFileSync(
        `${folderName}/${normaliseLocationPath(selectedFullStack.location.config.frontend.configFiles)}/${
            frontendRecipeConfig[0]
        }`,
        `${folderName}/${normaliseLocationPath(selectedFullStack.location.config.frontend.finalConfig)}`
    );
    // Remove the configs folder
    fs.rmSync(`${folderName}/${normaliseLocationPath(selectedFullStack.location.config.frontend.configFiles)}`, {
        recursive: true,
        force: true,
    });
    const backendFiles = fs.readdirSync(
        `./${folderName}/${normaliseLocationPath(selectedFullStack.location.config.backend.configFiles)}`
    );
    const backendRecipeConfig = backendFiles.filter((i) => i.includes(answers.recipe));
    if (backendRecipeConfig.length === 0) {
        throw new Error("Should never come here");
    }
    fs.copyFileSync(
        `${folderName}/${normaliseLocationPath(selectedFullStack.location.config.backend.configFiles)}/${
            backendRecipeConfig[0]
        }`,
        `${folderName}/${normaliseLocationPath(selectedFullStack.location.config.backend.finalConfig)}`
    );
    // Remove the configs folder
    fs.rmSync(`${folderName}/${normaliseLocationPath(selectedFullStack.location.config.backend.configFiles)}`, {
        recursive: true,
        force: true,
    });
    spinner.text = "Installing dependencies";
    const setupResult = new Promise((res) => {
        if (selectedFullStack.script === undefined || selectedFullStack.script.setup.length === 0) {
            // This means that no setup is required
            res({
                code: 0,
                error: undefined,
            });
            return;
        }
        let stderr = [];
        /**
         * Some stacks (Ex: Python) require all steps to be run in the same shell,
         * so we combine all setup commands in one single command and eecute that
         */
        const setupString = selectedFullStack.script.setup.join(" && ");
        // For full stack the folder doesnt have frontend and backend folders so we directly run the setup on the root
        const setup = exec(`cd ${folderName}/ && ${setupString}`);
        setup.on("exit", (code) => {
            const errorString = stderr.join("\n");
            res({
                code,
                error: errorString.length === 0 ? undefined : errorString,
            });
        });
        setup.stderr?.on("data", (data) => {
            // Record any messages printed as errors
            stderr.push(data.toString());
        });
        setup.stdout?.on("data", (data) => {
            /**
             * Record any messages printed as errors, we do this for stdout
             * as well because some scripts use the output stream for errors
             * too (npm for example) while others use stderr only
             *
             * This means that we will output everything if the script exits with
             * non zero
             */
            stderr.push(data.toString());
        });
    });
    const setupResultObj = await setupResult;
    if (setupResultObj.code !== 0) {
        const error = setupResultObj.error !== undefined ? setupResultObj.error : defaultSetupErrorString;
        throw new Error(error);
    }
    await performAdditionalSetupForFrontendIfNeeded(selectedFullStack, folderName, userArguments);
}
export async function setupProject(locations, folderName, answers, userArguments, spinner) {
    const isFullStack = locations.frontend === locations.backend;
    if (!isFullStack) {
        await setupFrontendBackendApp(answers, folderName, locations, userArguments, spinner);
    } else {
        await setupFullstack(answers, folderName, userArguments, spinner);
    }
}
export async function getAnalyticsId() {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const filePath = __dirname + "/analytics.json";
        if (fs.existsSync(filePath)) {
            let analyticsData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            if (analyticsData.userId !== undefined) {
                return analyticsData.userId;
            } else {
                analyticsData.userId = uuidv4();
                fs.writeFileSync(filePath, JSON.stringify(analyticsData), "utf-8");
                return analyticsData.userId;
            }
        } else {
            const userId = uuidv4();
            fs.writeFileSync(
                filePath,
                JSON.stringify({
                    userId,
                }),
                "utf-8"
            );
            return userId;
        }
    } catch (e) {
        return "error" + uuidv4();
    }
}
export async function runProjectOrPrintStartCommand(answers, userArguments) {
    const folderName = answers.appname;
    const selectedFrontend = (await getFrontendOptions(userArguments)).find((element) => {
        return element.value === answers.frontend;
    });
    if (selectedFrontend === undefined) {
        throw new Error("Should never come here");
    }
    let appRunScript = `${await getPackageManagerCommand(userArguments)} run start`;
    if (selectedFrontend.isFullStack) {
        appRunScript = selectedFrontend.script.run.join(" && ");
    }
    if (!getShouldAutoStartFromArgs(userArguments)) {
        Logger.log(
            `To start the application run the following command:` +
                chalk.greenBright(`\n\ncd ${folderName}\n` + appRunScript)
        );
        return;
    }
    Logger.success("Running the application...");
    const runProjectScript = new Promise((res, rej) => {
        let didReject = false;
        const rootRun = exec(`cd ${folderName}/ && ${appRunScript}`);
        rootRun.on("error", (error) => {
            didReject = true;
            rej(error.message);
        });
        rootRun.on("exit", (code) => {
            if (!didReject) {
                res(code);
            }
        });
        rootRun.stdout?.on("data", (data) => {
            console.log(data.toString());
        });
    });
    await runProjectScript;
}

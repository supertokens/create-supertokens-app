import { getFrontendOptions, getBackendOptions } from "./config.js";
import got from "got";
import tar from "tar";
import { promisify } from "util";
import stream from "node:stream";
import validateProjectName from "validate-npm-package-name";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import os from "os";
import { v4 as uuidv4 } from "uuid";
const pipeline = promisify(stream.pipeline);
const defaultSetupErrorString = "Project Setup Failed!";
function normaliseLocationPath(path) {
    if (path.startsWith("/")) {
        return path.slice(1);
    }
    return path;
}
export function getDownloadLocationFromAnswers(answers, userArguments) {
    const branchToUse = userArguments.branch || "master";
    const downloadURL = `https://codeload.github.com/supertokens/create-supertokens-app/tar.gz/${branchToUse}`;
    const selectedFrontend = getFrontendOptions(userArguments).find((element) => {
        return element.value === answers.frontend;
    });
    const selectedBackend = getBackendOptions(userArguments).find((element) => {
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
    await pipeline(
        got.stream(`${locations.download}`),
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
export function validateNpmName(name) {
    const nameValidation = validateProjectName(name);
    if (nameValidation.validForNewPackages) {
        return { valid: true };
    }
    return {
        valid: false,
        problems: [...(nameValidation.errors || []), ...(nameValidation.warnings || [])],
    };
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
async function setupFrontendBackendApp(answers, folderName, locations, userArguments, spinner) {
    var _a, _b;
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
    const selectedFrontend = getFrontendOptions(userArguments).find((element) => {
        return element.value === answers.frontend;
    });
    const selectedBackend = getBackendOptions(userArguments).find((element) => {
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
    spinner.text = "Installing frontend dependencies";
    const frontendSetup = new Promise((res) => {
        var _a, _b;
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
        (_a = setup.stderr) === null || _a === void 0
            ? void 0
            : _a.on("data", (data) => {
                  // Record any messages printed as errors
                  stderr.push(data.toString());
              });
        (_b = setup.stdout) === null || _b === void 0
            ? void 0
            : _b.on("data", (data) => {
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
    spinner.text = "Installing backend dependencies";
    const backendSetup = new Promise((res) => {
        var _a, _b;
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
        (_a = setup.stderr) === null || _a === void 0
            ? void 0
            : _a.on("data", (data) => {
                  // Record any messages printed as errors
                  stderr.push(data.toString());
              });
        (_b = setup.stdout) === null || _b === void 0
            ? void 0
            : _b.on("data", (data) => {
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
    // Create a root level package.json file
    fs.writeFileSync(
        `${folderName}/package.json`,
        getPackageJsonString({
            appname: answers.appname,
            runScripts: {
                frontend:
                    ((_a =
                        selectedFrontend === null || selectedFrontend === void 0 ? void 0 : selectedFrontend.script) ===
                        null || _a === void 0
                        ? void 0
                        : _a.run) || [],
                backend:
                    ((_b = selectedBackend === null || selectedBackend === void 0 ? void 0 : selectedBackend.script) ===
                        null || _b === void 0
                        ? void 0
                        : _b.run) || [],
            },
        })
    );
    const rootSetup = new Promise((res) => {
        var _a, _b;
        const rootInstall = exec(`cd ${folderName}/ && npm install`);
        let stderr = [];
        rootInstall.on("exit", (code) => {
            const errorString = stderr.join("\n");
            res({
                code,
                error: errorString.length === 0 ? undefined : errorString,
            });
        });
        (_a = rootInstall.stderr) === null || _a === void 0
            ? void 0
            : _a.on("data", (data) => {
                  // Record any messages printed as errors
                  stderr.push(data.toString());
              });
        (_b = rootInstall.stdout) === null || _b === void 0
            ? void 0
            : _b.on("data", (data) => {
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
    spinner.text = "Installing dependencies";
    const selectedFullStack = getFrontendOptions(userArguments).find((element) => {
        return element.value === answers.frontend;
    });
    if (selectedFullStack === undefined || selectedFullStack.isFullStack !== true) {
        throw new Error("Should never come here");
    }
    const setupResult = new Promise((res) => {
        var _a, _b;
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
        (_a = setup.stderr) === null || _a === void 0
            ? void 0
            : _a.on("data", (data) => {
                  // Record any messages printed as errors
                  stderr.push(data.toString());
              });
        (_b = setup.stdout) === null || _b === void 0
            ? void 0
            : _b.on("data", (data) => {
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
}
export async function setupProject(locations, folderName, answers, userArguments, spinner) {
    const isFullStack = locations.frontend === locations.backend;
    if (!isFullStack) {
        await setupFrontendBackendApp(answers, folderName, locations, userArguments, spinner);
    } else {
        await setupFullstack(answers, folderName, userArguments, spinner);
    }
}
export function getAnalyticsId() {
    const networkInterfaces = os.networkInterfaces();
    const values = Object.values(networkInterfaces);
    // The undefined check is to stop typescript from complaining
    if (values.length === 0 || values[0] === undefined) {
        // If no network interfaces are returned we generate a UUID and use that
        // Note that in this case every run of this script will be treated as a separate UUID
        return uuidv4();
    }
    return values[0][0].mac;
}
export function validateFolderName(name) {
    return validateNpmName(path.basename(path.resolve(name)));
}
export async function runProject(answers, userArguments) {
    const folderName = answers.appname;
    const selectedFrontend = getFrontendOptions(userArguments).find((element) => {
        return element.value === answers.frontend;
    });
    if (selectedFrontend === undefined) {
        throw new Error("Should never come here");
    }
    let appRunScript = "npm run start";
    if (selectedFrontend.isFullStack) {
        appRunScript = selectedFrontend.script.run.join(" && ");
    }
    const runProjectScript = new Promise((res, rej) => {
        var _a;
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
        (_a = rootRun.stdout) === null || _a === void 0
            ? void 0
            : _a.on("data", (data) => {
                  console.log(data.toString());
              });
    });
    await runProjectScript;
}

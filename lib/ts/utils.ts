import { getBackendOptionForProcessing, getFrontendOptionsForProcessing } from "./config.js";
import tar from "tar";
import { promisify } from "util";
import stream from "node:stream";
import { Answers, DownloadLocations, ExecOutput, QuestionOption, UserFlags, getRecipesFromFactors } from "./types.js";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";
import { Ora } from "ora";
import { getShouldAutoStartFromArgs } from "./userArgumentUtils.js";
import { Logger } from "./logger.js";
import chalk from "chalk";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import { addPackageCommand } from "./packageManager.js";
import { compileBackend } from "./templateBuilder/compiler.js";
import { ConfigType, FrontendFramework } from "./templateBuilder/types.js";
import { compileFrontend } from "./templateBuilder/compiler.js";
import { compileFullstack } from "./templateBuilder/compiler.js";

const pipeline = promisify(stream.pipeline);
const defaultSetupErrorString = "Project Setup Failed!";

function normaliseLocationPath(path: string): string {
    if (path.startsWith("/")) {
        return path.slice(1);
    }

    return path;
}

export async function getDownloadLocationFromAnswers(
    answers: Answers,
    userArguments: UserFlags
): Promise<DownloadLocations | undefined> {
    const branchToUse = userArguments.branch || "master";

    let downloadURL = `https://github.com/supertokens/create-supertokens-app/archive/${branchToUse}.tar.gz`;

    const selectedFrontend = (await getFrontendOptionsForProcessing(userArguments)).find((element) => {
        return element.value === answers.frontend;
    });

    if (selectedFrontend?.externalAppInfo?.isExternal === true) {
        downloadURL = selectedFrontend!.location.main;
    }

    const selectedBackend = (await getBackendOptionForProcessing(userArguments)).find((element) => {
        return element.value === answers.backend;
    });

    if (selectedFrontend !== undefined && selectedFrontend.isFullStack === true) {
        return {
            frontend: normaliseLocationPath(selectedFrontend.location.main),
            backend: normaliseLocationPath(selectedFrontend.location.main),
            download: downloadURL,
            isExternalApp: selectedFrontend?.externalAppInfo?.isExternal === true,
        };
    }

    if (selectedFrontend !== undefined && selectedBackend !== undefined) {
        return {
            frontend: normaliseLocationPath(selectedFrontend.location.main),
            backend: normaliseLocationPath(selectedBackend.location.main),
            download: downloadURL,
        };
    }

    return undefined;
}

export async function downloadExternalApp(locations: DownloadLocations, folderName: string): Promise<void> {
    const downloadResponse = await fetch(locations.download);

    if (!downloadResponse.ok || downloadResponse.body === null) {
        throw new Error("Failed to download project");
    }

    await pipeline(
        downloadResponse.body,
        tar.extract(
            {
                cwd: `./${folderName}`,
                strip: 1,
                strict: true,
            },
            []
        )
    );
}

export async function downloadApp(locations: DownloadLocations, folderName: string): Promise<void> {
    const __dirname = path.resolve();
    const projectDirectory = __dirname + `/${folderName}`;

    if (fs.existsSync(projectDirectory)) {
        throw new Error(`A folder with name "${folderName}" already exists`);
    }

    fs.mkdirSync(projectDirectory);

    const isFullStack = locations.frontend === locations.backend;

    if (locations.isExternalApp === true) {
        return await downloadExternalApp(locations, folderName);
    }

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
                    let frontendLocation = locations.frontend;
                    let backendLocation = locations.backend;

                    if (!frontendLocation.endsWith("/")) {
                        frontendLocation += "/";
                    }

                    if (!backendLocation.endsWith("/")) {
                        backendLocation += "/";
                    }

                    if (path.includes(frontendLocation)) {
                        return true;
                    }

                    if (path.includes(backendLocation)) {
                        return true;
                    }

                    return false;
                },
            },
            []
        )
    );
}

function getPackageJsonString(input: {
    appname: string;
    runScripts: {
        frontend: string[];
        backend: string[];
    };
}): string {
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
            "start:frontend-live-demo-app": "cd frontend && npx serve -s build",
            "start:backend": "cd backend && ${backendStartScript}",
            "start:backend-live-demo-app": "cd backend && ./startLiveDemoApp.sh",
            "start": "npm-run-all --parallel start:frontend start:backend",
            "start-live-demo-app": "npx npm-run-all --parallel start:frontend-live-demo-app start:backend-live-demo-app"
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

async function performAdditionalSetupForFrontendIfNeeded(
    selectedFrontend: QuestionOption,
    folderName: string,
    userArguments: UserFlags
) {
    const sourceFolder = selectedFrontend.isFullStack !== true ? `${folderName}/frontend` : `${folderName}`;

    const doesUseAuthReact = fs.existsSync(`${sourceFolder}/node_modules/supertokens-auth-react`);

    const doesWebJsExist = (): boolean => {
        const doesExistInNodeModules = fs.existsSync(`${sourceFolder}/node_modules/supertokens-web-js`);
        const doesExistInAuthReact = fs.existsSync(
            `${sourceFolder}/node_modules/supertokens-auth-react/node_modules/supertokens-web-js`
        );

        return doesExistInAuthReact || doesExistInNodeModules;
    };

    if (doesUseAuthReact && !doesWebJsExist()) {
        const installPrefix = addPackageCommand(userArguments.manager);

        let result = await new Promise<ExecOutput>((res) => {
            let stderr: string[] = [];
            if (userArguments.skipInstall === true) {
                res({ code: 0, error: undefined });
                return;
            }
            const additionalSetup = exec(`cd ${sourceFolder} && ${installPrefix} supertokens-web-js`);

            additionalSetup.on("exit", (code) => {
                const errorString = stderr.join("\n");
                res({
                    code,
                    error: errorString.length === 0 ? undefined : errorString,
                });
            });

            additionalSetup.stderr?.on("data", (data) => {
                stderr.push(data.toString());
            });

            additionalSetup.stdout?.on("data", (data) => {
                stderr.push(data.toString());
            });
        });

        if (result.code !== 0) {
            const error = result.error !== undefined ? result.error : defaultSetupErrorString;
            throw new Error(error);
        }
    }

    const frontendFiles = fs.readdirSync(`${sourceFolder}`);
    let actualBundleSource = "";
    async function processFile(filePath: string): Promise<void> {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (filePath.includes("node_modules")) {
                return;
            }
            const files = fs.readdirSync(filePath);
            for (const file of files) {
                await processFile(path.join(filePath, file));
            }
        } else {
            const fileContent = fs.readFileSync(filePath, "utf8");
            if (fileContent.includes("${jsdeliveryprebuiltuiurl}")) {
                if (actualBundleSource === "") {
                    const response = await fetch("https://api.supertokens.com/0/frontend/auth-react");
                    if (!response.ok) {
                        throw new Error(
                            "Failed to fetch the actual bundle source for pre built UI. Please try again in sometime"
                        );
                    }
                    const data: any = await response.json();
                    actualBundleSource = data.uri;
                }
                const updatedContent = fileContent.replace("${jsdeliveryprebuiltuiurl}", actualBundleSource);
                fs.writeFileSync(filePath, updatedContent);
            }
        }
    }

    for (const file of frontendFiles) {
        await processFile(`${sourceFolder}/${file}`);
    }
}

export function checkMfaCompatibility(answers: Answers, userArguments: UserFlags): void {
    const hasMFA =
        answers.recipe === "multifactorauth" || (userArguments.secondfactors && userArguments.secondfactors.length > 0);

    const isGoBackend =
        answers.backend !== undefined && (answers.backend.includes("go") || answers.backend === "go-http");

    if (hasMFA && isGoBackend) {
        console.warn(
            "\x1b[33m%s\x1b[0m",
            "⚠️  Warning: Multi-factor authentication is not fully supported in the Go SDK yet. " +
                "The generated app may not have full MFA functionality. " +
                "Consider using a Node.js/Express backend for complete MFA support."
        );
    }
}

async function setupFrontendBackendApp(
    answers: Answers,
    folderName: string,
    locations: DownloadLocations,
    userArguments: UserFlags,
    spinner: Ora
) {
    const frontendFolderName = locations.frontend
        .split("/")
        .filter((i: string) => i !== "frontend")
        .join("");
    const backendFolderName = locations.backend
        .split("/")
        .filter((i: string) => i !== "backend")
        .join("");

    const __dirname = path.resolve();
    const frontendDirectory = __dirname + `/${folderName}/${frontendFolderName}`;
    const backendDirectory = __dirname + `/${folderName}/${backendFolderName}`;

    fs.renameSync(frontendDirectory, __dirname + `/${folderName}/frontend`);
    fs.renameSync(backendDirectory, __dirname + `/${folderName}/backend`);

    const selectedFrontend = (await getFrontendOptionsForProcessing(userArguments)).find((element) => {
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

    let configType = answers.recipe as ConfigType;
    if (userArguments.firstfactors || userArguments.secondfactors) {
        const factorConfig = {
            firstFactors: userArguments.firstfactors || [],
            secondFactors: userArguments.secondfactors || undefined,
        };
        const recipes = getRecipesFromFactors(factorConfig);
        configType = recipes[0] as ConfigType;
    }

    for (const config of selectedFrontend.location.config) {
        const generatedConfig = compileFrontend({
            framework: selectedFrontend.value as FrontendFramework,
            configType,
            userArguments,
        });

        const configPath = `${folderName}/frontend/${normaliseLocationPath(config.finalConfig)}`;
        if (process.env.DEBUG === "true") {
            console.log("Writing config to:", configPath);
        }
        fs.writeFileSync(configPath, generatedConfig);

        if (fs.existsSync(`${folderName}/frontend/${normaliseLocationPath(config.configFiles)}`)) {
            fs.rmSync(`${folderName}/frontend/${normaliseLocationPath(config.configFiles)}`, {
                recursive: true,
                force: true,
            });
        }
    }

    if (selectedBackend.location === undefined) {
        throw new Error("Should not come here");
    }

    const backendLang = selectedBackend.value.includes("python")
        ? "py"
        : selectedBackend.value.includes("go")
        ? "go"
        : "ts";

    for (const config of selectedBackend.location.config) {
        const generatedConfig = compileBackend({
            language: backendLang,
            configType,
            userArguments,
        });

        const configPath = `${folderName}/backend/${normaliseLocationPath(config.finalConfig)}`;
        fs.writeFileSync(configPath, generatedConfig);

        if (fs.existsSync(`${folderName}/backend/${normaliseLocationPath(config.configFiles)}`)) {
            fs.rmSync(`${folderName}/backend/${normaliseLocationPath(config.configFiles)}`, {
                recursive: true,
                force: true,
            });
        }
    }

    spinner.text = "Installing frontend dependencies";
    const frontendSetup = new Promise<ExecOutput>((res) => {
        let stderr: string[] = [];

        if (selectedFrontend.script === undefined || selectedFrontend.script.setup.length === 0) {
            res({
                code: 0,
                error: undefined,
            });
            return;
        }

        const setupString = selectedFrontend.script.setup.join(" && ");

        if (userArguments.skipInstall === true) {
            res({ code: 0, error: undefined });
            return;
        }
        const setup = exec(`cd ${folderName}/frontend && ${setupString}`);

        setup.on("exit", (code) => {
            const errorString = stderr.join("\n");
            res({
                code,
                error: errorString.length === 0 ? undefined : errorString,
            });
        });

        setup.stderr?.on("data", (data) => {
            stderr.push(data.toString());
        });

        setup.stdout?.on("data", (data) => {
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
    const backendSetup = new Promise<ExecOutput>((res) => {
        let stderr: string[] = [];

        if (selectedBackend.script === undefined || selectedBackend.script.setup.length === 0) {
            res({
                code: 0,
                error: undefined,
            });
            return;
        }

        const setupString = selectedBackend.script.setup.join(" && ");

        if (userArguments.skipInstall === true) {
            res({ code: 0, error: undefined });
            return;
        }
        const setup = exec(`cd ${folderName}/backend && ${setupString}`);

        setup.on("exit", (code) => {
            const errorString = stderr.join("\n");
            res({
                code,
                error: errorString.length === 0 ? undefined : errorString,
            });
        });

        setup.stderr?.on("data", (data) => {
            stderr.push(data.toString());
        });

        setup.stdout?.on("data", (data) => {
            stderr.push(data.toString());
        });
    });

    const backendSetupResult = await backendSetup;

    if (backendSetupResult.code !== 0) {
        const error = backendSetupResult.error !== undefined ? backendSetupResult.error : defaultSetupErrorString;

        throw new Error(error);
    }

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

    const rootSetup = new Promise<ExecOutput>((res) => {
        let stderr: string[] = [];

        // Skip if --skip-install is passed
        if (userArguments.skipInstall === true) {
            res({ code: 0, error: undefined });
            return;
        }

        const rootInstall = exec(`cd ${folderName}/ && ${userArguments.manager} install`);

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

async function setupFullstack(answers: Answers, folderName: string, userArguments: UserFlags, spinner: Ora) {
    const selectedFullStack = (await getFrontendOptionsForProcessing(userArguments)).find((element) => {
        return element.value === answers.frontend;
    });

    if (selectedFullStack === undefined || selectedFullStack.isFullStack !== true) {
        throw new Error("Should never come here");
    }

    spinner.text = "Configuring files";

    // Convert factors to recipes if they are provided
    let configType = answers.recipe as ConfigType;
    if (userArguments.firstfactors || userArguments.secondfactors) {
        const factorConfig = {
            firstFactors: userArguments.firstfactors || [],
            secondFactors: userArguments.secondfactors || undefined,
        };
        const recipes = getRecipesFromFactors(factorConfig);
        configType = recipes[0] as ConfigType;
    }

    // Handle frontend config using the compiler
    for (const config of selectedFullStack.location.config.frontend) {
        // Generate the frontend configuration using the compiler
        const generatedConfig = compileFullstack({
            framework: selectedFullStack.value,
            configType,
            component: "frontend",
            userArguments,
        });

        // Write the generated configuration
        const configPath = `${folderName}/${normaliseLocationPath(config.finalConfig)}`;
        fs.writeFileSync(configPath, generatedConfig);

        // Remove the original configs folder if it exists
        if (fs.existsSync(`${folderName}/${normaliseLocationPath(config.configFiles)}`)) {
            fs.rmSync(`${folderName}/${normaliseLocationPath(config.configFiles)}`, {
                recursive: true,
                force: true,
            });
        }
    }

    for (const config of selectedFullStack.location.config.backend) {
        // Generate the configuration using the fullstack compiler for backend
        const generatedConfig = compileFullstack({
            framework: selectedFullStack.value,
            configType,
            component: "backend",
            userArguments,
        });

        // Write the generated configuration
        const configPath = `${folderName}/${normaliseLocationPath(config.finalConfig)}`;
        fs.writeFileSync(configPath, generatedConfig);

        // Remove the original configs folder if it exists
        if (fs.existsSync(`${folderName}/${normaliseLocationPath(config.configFiles)}`)) {
            fs.rmSync(`${folderName}/${normaliseLocationPath(config.configFiles)}`, {
                recursive: true,
                force: true,
            });
        }
    }

    spinner.text = "Installing dependencies";

    const setupResult = new Promise<ExecOutput>((res) => {
        if (selectedFullStack.script === undefined || selectedFullStack.script.setup.length === 0) {
            // This means that no setup is required
            res({
                code: 0,
                error: undefined,
            });
            return;
        }

        let stderr: string[] = [];

        /**
         * Some stacks (Ex: Python) require all steps to be run in the same shell,
         * so we combine all setup commands in one single command and execute that
         */
        const setupString = selectedFullStack.script.setup.join(" && ");

        // For full stack the folder doesn't have frontend and backend folders so we directly run the setup on the root
        // Skip if --skip-install is passed
        if (userArguments.skipInstall === true) {
            res({ code: 0, error: undefined });
            return;
        }
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

export async function setupProject(
    locations: DownloadLocations,
    folderName: string,
    answers: Answers,
    userArguments: UserFlags,
    spinner: Ora
) {
    if (locations.isExternalApp === true) {
        return;
    }

    const isFullStack = locations.frontend === locations.backend;

    if (!isFullStack) {
        await setupFrontendBackendApp(answers, folderName, locations, userArguments, spinner);
    } else {
        await setupFullstack(answers, folderName, userArguments, spinner);
    }
}

export async function getAnalyticsId(): Promise<string> {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const filePath = __dirname + "/analytics.json";

        if (fs.existsSync(filePath)) {
            let analyticsData: {
                userId: string | undefined;
            } = JSON.parse(fs.readFileSync(filePath, "utf-8"));

            if (analyticsData.userId !== undefined) {
                return analyticsData.userId;
            } else {
                analyticsData.userId = uuidv4();

                fs.writeFileSync(filePath, JSON.stringify(analyticsData), "utf-8");
                return analyticsData.userId;
            }
        } else {
            const userId: string = uuidv4();

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

export async function runProjectOrPrintStartCommand(answers: Answers, userArguments: UserFlags) {
    const folderName = answers.appname;

    const selectedFrontend = (await getFrontendOptionsForProcessing(userArguments)).find((element) => {
        return element.value === answers.frontend;
    });

    if (selectedFrontend === undefined) {
        throw new Error("Should never come here");
    }

    if (selectedFrontend.externalAppInfo?.isExternal === true) {
        Logger.log(selectedFrontend.externalAppInfo.message);
        return;
    }

    let appRunScript = `${userArguments.manager} run start`;

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

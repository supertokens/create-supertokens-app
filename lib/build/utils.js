import { nextFullStackLocation, frontendOptions, backendOptions } from "./config.js";
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
function normaliseLocationPath(path) {
    if (path.startsWith("/")) {
        return path.slice(1);
    }
    return path;
}
export function getDownloadLocationFromAnswers(answers) {
    const downloadURL = "https://codeload.github.com/supertokens/create-supertokens-app/tar.gz/boilerplate-emailpassword";
    if (answers.nextfullstack === true) {
        return {
            frontend: normaliseLocationPath(nextFullStackLocation.main),
            backend: normaliseLocationPath(nextFullStackLocation.main),
            download: downloadURL,
        };
    }
    const selectedFrontend = frontendOptions.find((element) => {
        return element.value === answers.frontend;
    });
    const selectedBackend = backendOptions.find((element) => {
        return element.value === answers.backend;
    });
    // Locations are only undefined for recipe options so in this case you never expect them to be undefined
    if (selectedFrontend !== undefined && selectedFrontend.location !== undefined && selectedBackend !== undefined && selectedBackend.location !== undefined) {
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
    await pipeline(got.stream(`${locations.download}`), tar.extract({
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
        }
    }, []));
}
export function validateNpmName(name) {
    const nameValidation = validateProjectName(name);
    if (nameValidation.validForNewPackages) {
        return { valid: true };
    }
    return {
        valid: false,
        problems: [
            ...(nameValidation.errors || []),
            ...(nameValidation.warnings || []),
        ],
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
async function setupFrontendBackendApp(answers, folderName, locations) {
    var _a, _b;
    const frontendFolderName = locations.frontend.split("/").filter(i => i !== "frontend").join("");
    const backendFolderName = locations.backend.split("/").filter(i => i !== "backend").join("");
    const __dirname = path.resolve();
    const frontendDirectory = __dirname + `/${folderName}/${frontendFolderName}`;
    const backendDirectory = __dirname + `/${folderName}/${backendFolderName}`;
    // Rename the folders to frontend and backend
    fs.renameSync(frontendDirectory, __dirname + `/${folderName}/frontend`);
    fs.renameSync(backendDirectory, __dirname + `/${folderName}/backend`);
    const selectedFrontend = frontendOptions.find((element) => {
        return element.value === answers.frontend;
    });
    const selectedBackend = backendOptions.find((element) => {
        return element.value === answers.backend;
    });
    if (selectedFrontend === undefined || selectedBackend === undefined) {
        throw new Error("Should never come here");
    }
    const frontendSetup = new Promise((res, rej) => {
        var _a;
        let didReject = false;
        if (selectedFrontend === undefined || selectedFrontend.script === undefined) {
            res(0);
            return;
        }
        const setupString = selectedFrontend.script.setup.join(" && ");
        const setup = exec(`cd ${folderName}/frontend && ${setupString}`);
        setup.on("error", error => {
            didReject = true;
            rej(error.message);
        });
        setup.on("exit", code => {
            if (!didReject) {
                res(code);
            }
        });
        (_a = setup.stdout) === null || _a === void 0 ? void 0 : _a.on("data", data => {
            console.log(data.toString());
        });
    });
    const frontendCode = await frontendSetup;
    const backendSetup = new Promise((res, rej) => {
        var _a;
        let didReject = false;
        if (selectedBackend === undefined || selectedBackend.script === undefined) {
            res(0);
            return;
        }
        const setupString = selectedBackend.script.setup.join(" && ");
        const setup = exec(`cd ${folderName}/backend && ${setupString}`);
        setup.on("error", error => {
            didReject = true;
            rej(error.message);
        });
        setup.on("exit", code => {
            if (!didReject) {
                res(code);
            }
        });
        (_a = setup.stdout) === null || _a === void 0 ? void 0 : _a.on("data", data => {
            console.log(data.toString());
        });
    });
    // Call the frontend and backend setup scripts
    const backendCode = await backendSetup;
    if (frontendCode !== 0 || backendCode !== 0) {
        throw new Error("Project setup failed!");
    }
    if (selectedFrontend.location === undefined) {
        throw new Error("Should never come here");
    }
    // Move the recipe config file for the frontend folder to the correct place
    const frontendFiles = fs.readdirSync(`./${folderName}/frontend/${normaliseLocationPath(selectedFrontend.location.configFiles)}`);
    const frontendRecipeConfig = frontendFiles.filter(i => i.includes(answers.recipe));
    if (frontendRecipeConfig.length === 0) {
        throw new Error("Should never come here");
    }
    fs.copyFileSync(`${folderName}/frontend/${normaliseLocationPath(selectedFrontend.location.configFiles)}/${frontendRecipeConfig[0]}`, `${folderName}/frontend/${normaliseLocationPath(selectedFrontend.location.finalConfig)}`);
    // Remove the configs folder
    fs.rmSync(`${folderName}/frontend/${normaliseLocationPath(selectedFrontend.location.configFiles)}`, {
        recursive: true,
        force: true,
    });
    if (selectedBackend.location === undefined) {
        throw new Error("Should not come here");
    }
    // TODO: Handle using the correct config file for backend
    const backendFiles = fs.readdirSync(`./${folderName}/backend/${normaliseLocationPath(selectedBackend.location.configFiles)}`);
    const backendRecipeConfig = backendFiles.filter(i => i.includes(answers.recipe));
    if (backendRecipeConfig.length === 0) {
        throw new Error("Should never come here");
    }
    fs.copyFileSync(`${folderName}/backend/${normaliseLocationPath(selectedBackend.location.configFiles)}/${backendRecipeConfig[0]}`, `${folderName}/backend/${normaliseLocationPath(selectedBackend.location.finalConfig)}`);
    // Remove the configs folder
    fs.rmSync(`${folderName}/backend/${normaliseLocationPath(selectedBackend.location.configFiles)}`, {
        recursive: true,
        force: true,
    });
    // Create a root level package.json file
    fs.writeFileSync(`${folderName}/package.json`, getPackageJsonString({
        appname: answers.appname,
        runScripts: {
            frontend: ((_a = selectedFrontend === null || selectedFrontend === void 0 ? void 0 : selectedFrontend.script) === null || _a === void 0 ? void 0 : _a.run) || [],
            backend: ((_b = selectedBackend === null || selectedBackend === void 0 ? void 0 : selectedBackend.script) === null || _b === void 0 ? void 0 : _b.run) || [],
        },
    }));
    const rootSetup = new Promise((res, rej) => {
        var _a;
        let didReject = false;
        const rootInstall = exec(`cd ${folderName}/ && npm install`);
        rootInstall.on("error", error => {
            didReject = true;
            rej(error.message);
        });
        rootInstall.on("exit", code => {
            if (!didReject) {
                res(code);
            }
        });
        (_a = rootInstall.stdout) === null || _a === void 0 ? void 0 : _a.on("data", data => {
            console.log(data.toString());
        });
    });
    await rootSetup;
}
async function setupFullstack(answers, folderName) {
    const selectedFrontend = frontendOptions.find((element) => {
        return element.value === answers.frontend;
    });
    const frontendSetup = new Promise((res, rej) => {
        var _a;
        let didReject = false;
        if (selectedFrontend === undefined || selectedFrontend.script === undefined) {
            res(0);
            return;
        }
        const setupString = selectedFrontend.script.setup.join(" && ");
        // For full stack the folder doesnt have frontend and backend folders so we directly run the setup on the root
        const setup = exec(`cd ${folderName}/ && ${setupString}`);
        setup.on("error", error => {
            didReject = true;
            rej(error.message);
        });
        setup.on("exit", code => {
            if (!didReject) {
                res(code);
            }
        });
        (_a = setup.stdout) === null || _a === void 0 ? void 0 : _a.on("data", data => {
            console.log(data.toString());
        });
    });
    const frontendCode = await frontendSetup;
    if (frontendCode !== 0) {
        throw new Error("Project setup failed!");
    }
    // TODO: Handle using the correct config file for frontend
    // TODO: Handle using the correct config file for backend
}
export async function setupProject(locations, folderName, answers) {
    const isFullStack = locations.frontend === locations.backend;
    if (!isFullStack) {
        await setupFrontendBackendApp(answers, folderName, locations);
    }
    else {
        await setupFullstack(answers, folderName);
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
export async function runProject(folderName) {
    const runProjectScript = new Promise((res, rej) => {
        var _a;
        let didReject = false;
        const rootRun = exec(`cd ${folderName}/ && npm run start`);
        rootRun.on("error", error => {
            didReject = true;
            rej(error.message);
        });
        rootRun.on("exit", code => {
            if (!didReject) {
                res(code);
            }
        });
        (_a = rootRun.stdout) === null || _a === void 0 ? void 0 : _a.on("data", data => {
            console.log(data.toString());
        });
    });
    await runProjectScript;
}

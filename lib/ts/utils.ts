import { nextFullStackLocation, frontendOptions, backendOptions } from "./config.js";
import got from "got";
import tar from "tar";
import { promisify } from "util";
import stream from "node:stream";
import { Answers, DownloadLocations } from "./types";
import validateProjectName from "validate-npm-package-name";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import os from "os";
import {v4 as uuidv4} from "uuid";

const pipeline = promisify(stream.pipeline);

function normaliseLocationPath(path: string): string {
    if (path.startsWith("/")) {
        return path.slice(1);
    }

    return path;
}

export function getDownloadLocationFromAnswers(answers: Answers): DownloadLocations | undefined {
    const downloadURL = "https://codeload.github.com/supertokens/create-supertokens-app/tar.gz/master"

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
        }
    }

    return undefined;
}

export async function downloadApp(locations: DownloadLocations, folderName: string): Promise<void> {
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
        tar.extract({
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
        }, [])
    )
}

export function validateNpmName(name: string): {
    valid: boolean
    problems?: string[]
  } {
    const nameValidation = validateProjectName(name)
    if (nameValidation.validForNewPackages) {
      return { valid: true }
    }
  
    return {
      valid: false,
      problems: [
        ...(nameValidation.errors || []),
        ...(nameValidation.warnings || []),
      ],
    }
  }

function getPackageJsonString(input: {
    appname: string,
    runScripts: {
        frontend: string[],
        backend: string[],
    },
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
            "start:frontend": "${frontendStartScript}",
            "start:backend": "${backendStartScript}",
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

async function setupFrontendBackendApp(answers: Answers, folderName: string, locations: DownloadLocations) {
    const frontendFolderName = locations.frontend.split("/").filter(i => i !== "frontend").join("")
    const backendFolderName = locations.backend.split("/").filter(i => i !== "backend").join("")

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

    const frontendSetup = new Promise((res, rej) => {
        let didReject = false;

        if (selectedFrontend === undefined || selectedFrontend.script === undefined) {
            res(0);
            return;
        }

        const setupString = selectedFrontend.script.setup.join(" && ");

        const setup = exec(`cd ${folderName}/frontend && ${setupString}`)

        setup.on("error", error => {
            didReject = true;
            rej(error.message);
        });

        setup.on("exit", code => {
            if (!didReject) {
                res(code);
            }
        })

        setup.stdout?.on("data", data => {
            console.log(data.toString())
        })
    });

    const backendSetup = new Promise((res, rej) => {
        let didReject = false;

        if (selectedBackend === undefined || selectedBackend.script === undefined) {
            res(0);
            return;
        }

        const setupString = selectedBackend.script.setup.join(" && ");

        const setup = exec(`cd ${folderName}/backend && ${setupString}`)

        setup.on("error", error => {
            didReject = true;
            rej(error.message);
        });

        setup.on("exit", code => {
            if (!didReject) {
                res(code);
            }
        })

        setup.stdout?.on("data", data => {
            console.log(data.toString())
        })
    });

    // Call the frontend and backend setup scripts
    const frontendCode = await frontendSetup;
    const backendCode = await backendSetup;

    if (frontendCode !== 0 || backendCode !== 0) {
        throw new Error("Project setup failed!")
    }

    // Create a root level package.json file
    fs.writeFileSync(`${folderName}/package.json`, getPackageJsonString({
        appname: answers.appname,
        runScripts: {
            frontend: selectedFrontend?.script?.run || [],
            backend: selectedBackend?.script?.run || [],
        },
    }));

    const rootSetup = new Promise((res, rej) => {
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
        })

        rootInstall.stdout?.on("data", data => {
            console.log(data.toString())
        })
    });

    await rootSetup;
}

async function setupFullstack(answers: Answers, folderName: string) {
    const selectedFrontend = frontendOptions.find((element) => {
        return element.value === answers.frontend;
    });

    const frontendSetup = new Promise((res, rej) => {
        let didReject = false;

        if (selectedFrontend === undefined || selectedFrontend.script === undefined) {
            res(0);
            return;
        }
        
        const setupString = selectedFrontend.script.setup.join(" && ");

        // For full stack the folder doesnt have frontend and backend folders so we directly run the setup on the root
        const setup = exec(`cd ${folderName}/ && ${setupString}`)

        setup.on("error", error => {
            didReject = true;
            rej(error.message);
        });

        setup.on("exit", code => {
            if (!didReject) {
                res(code);
            }
        })

        setup.stdout?.on("data", data => {
            console.log(data.toString())
        })
    });

    const frontendCode = await frontendSetup;

    if (frontendCode !== 0) {
        throw new Error("Project setup failed!")
    }
}

export async function setupProject(locations: DownloadLocations, folderName: string, answers: Answers) {
    const isFullStack = locations.frontend === locations.backend;

    if (!isFullStack) {
        await setupFrontendBackendApp(answers, folderName, locations);
    } else {
        await setupFullstack(answers, folderName);
    }
}

export function getAnalyticsId(): string {
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

export function validateFolderName(name: string): {
    valid: boolean;
    problems?: string[] | undefined;
} {
    return validateNpmName(path.basename(path.resolve(name)));
}
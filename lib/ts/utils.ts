import { nextFullStackLocation, frontendOptions, backendOptions } from "./config.js";
import got from "got";
import tar from "tar";
import { promisify } from "util";
import stream from "node:stream";
import { Answers, DownloadLocations } from "./types";
import validateProjectName from "validate-npm-package-name";
import fs from "fs";
import path from "path";
// import { spawn } from "child_process";

const pipeline = promisify(stream.pipeline);

function normaliseLocationPath(path: string): string {
    if (path.startsWith("/")) {
        return path.slice(1);
    }

    return path;
}

export function getDownloadLocationFromAnswers(answers: Answers): DownloadLocations | undefined {
    const downloadURL = "https://codeload.github.com/supertokens/create-supertokens-app/tar.gz/setup"

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
        console.log(`A folder with name "${folderName}" already exists`);
        return;
    }

    // Create the directory to download the boilerplate
    fs.mkdirSync(projectDirectory);

    await pipeline(
        got.stream(`${locations.download}`),
        tar.extract({
            cwd: `./${folderName}`, 
            strip: 2,
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

    setupProject(locations, folderName);

    // await new Promise((res, rej) => {
    //     const response = spawn(`cd `)
    // });
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

function setupProject(locations: DownloadLocations, folderName: string) {
    const frontendFolderName = locations.frontend.split("/").filter(i => i !== "frontend").join("")
    const backendFolderName = locations.backend.split("/").filter(i => i !== "backend").join("")

    const __dirname = path.resolve();
    const frontendDirectory = __dirname + `/${folderName}/${frontendFolderName}`;
    const backendDirectory = __dirname + `/${folderName}/${backendFolderName}`;

    fs.renameSync(frontendDirectory, __dirname + `/${folderName}/frontend`);
    fs.renameSync(backendDirectory, __dirname + `/${folderName}/backend`);
}
import { nextFullStackLocation, frontendOptions, backendOptions } from "./config.js";
import got from "got";
import tar from "tar";
import { promisify } from "util";
import { Stream } from "stream";

const pipeline = promisify(Stream.pipeline);

function normaliseLocationPath(path) {
    if (path.startsWith("/")) {
        return path.slice(1);
    }

    return path;
}

/**
 * Returns an object that contains locations to be used for loading the app
 * 
 * {
 *      download: string,
 *      frontend: string,
 *      backend: string,
 * }
 * 
 * download: Location of the repository that contains the frontend and backend projects for the given combination
 * frontend: Path of the frontend project relative to the download location
 * backend: Path of the backend project relative to the download location
 */
export function getFolderCombinationFromAnswers(answers) {
    const downloadURL = "https://codeload.github.com/supertokens/create-supertokens-app/tar.gz/setup"

    if (answers.frontend === "next" && answers.backend === "next") {
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

    if (selectedFrontend !== undefined && selectedBackend !== undefined) {
        return {
            frontend: normaliseLocationPath(selectedFrontend.location.main),
            backend: normaliseLocationPath(selectedBackend.location.main),
            download: downloadURL,
        }
    }
}

export async function downloadApp(locations) {
    return await pipeline(
        got.stream(`${locations.download}`),
        tar.extract({}, [])
    )
}
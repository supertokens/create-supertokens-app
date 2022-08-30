const { nextFullStackLocation, frontendOptions, backendOptions } = require("./config");
const tar = require("tar");
const { promisify } = require("util");
const { Stream } = require("stream");

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
module.exports.getFolderCombinationFromAnswers = function(answers) {
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

module.exports.downloadApp = async function (locations) {
    const { default: got } = await import("got");
    return await pipeline(
        got.stream(`${locations.download}`),
        tar.extract({}, ["create-supertokens-app/boilerplate"])
    )
}
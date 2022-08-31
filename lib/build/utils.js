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
export function getDownloadLocationFromAnswers(answers) {
    const downloadURL = "https://codeload.github.com/supertokens/create-supertokens-app/tar.gz/setup";
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
export async function downloadApp(locations) {
    console.log(locations);
    await pipeline(got.stream(`${locations.download}`), tar.extract({ strict: true, strip: 2, onwarn: (message, _) => {
            console.log(message);
        } }, []));
}

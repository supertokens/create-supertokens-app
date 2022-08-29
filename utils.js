const { nextFullStackLocation, frontendOptions, backendOptions } = require("./config");

function normaliseLocationPath(path) {
    if (path.startsWith("/")) {
        return path.slice(1);
    }

    return path;
}

module.exports.getFolderCombinationFromAnswers = function(answers) {
    const CLIRepoURL = "https://github.com/supertokens/create-supertokens-app/"

    if (answers.frontend === "next" && answers.backend === "next") {
        return {
            frontend: CLIRepoURL + normaliseLocationPath(nextFullStackLocation.main),
            backend: CLIRepoURL + normaliseLocationPath(nextFullStackLocation.main),
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
            frontend: CLIRepoURL + normaliseLocationPath(selectedFrontend.location.main),
            backend: CLIRepoURL + normaliseLocationPath(selectedBackend.location.main),
        }
    }
}
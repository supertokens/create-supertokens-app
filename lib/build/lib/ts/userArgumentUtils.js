import {
    allBackends,
    allFrontends,
    allPackageManagers,
    allRecipes,
    isValidBackend,
    isValidFrontend,
    isValidPackageManager,
    isValidRecipeName,
} from "./types.js";
import validateProjectName from "validate-npm-package-name";
import path from "path";
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
export function validateFolderName(name) {
    return validateNpmName(path.basename(path.resolve(name)));
}
export function validateUserArguments(userArguments) {
    if (userArguments.dashboardDemo !== undefined) {
        if (userArguments.dashboardDemo !== "true") {
            throw new Error("When using --dashboardDemo, please always set the value to true");
        }
        return;
    }
    if (userArguments.appname !== undefined) {
        const validation = validateFolderName(userArguments.appname);
        if (validation.valid !== true) {
            throw new Error("Invalid project name: " + validation.problems[0]);
        }
    }
    if (userArguments.recipe !== undefined) {
        if (!isValidRecipeName(userArguments.recipe)) {
            const availableRecipes = allRecipes.map((e) => `    - ${e}`).join("\n");
            throw new Error("Invalid recipe name provided, valid values:\n" + availableRecipes);
        }
    }
    if (userArguments.frontend !== undefined) {
        if (!isValidFrontend(userArguments.frontend)) {
            const availableFrontends = allFrontends.map((e) => `    - ${e.id}`).join("\n");
            throw new Error("Invalid frontend provided, valid values:\n" + availableFrontends);
        }
    }
    if (userArguments.backend !== undefined) {
        if (!isValidBackend(userArguments.backend)) {
            const avaiableBackends = allBackends.map((e) => `    - ${e.id}`).join("\n");
            throw new Error("Invalid backend provided, valid values:\n" + avaiableBackends);
        }
    }
    if (userArguments.manager !== undefined) {
        if (!isValidPackageManager(userArguments.manager)) {
            const availableManagers = allPackageManagers.map((e) => `    - ${e}`).join("\n");
            throw new Error("Invalid package manager provided, valid values:\n" + availableManagers);
        }
    }
}
export function modifyAnswersBasedOnSelection(answers) {
    let _answers = answers;
    if ("frontendNext" in _answers) {
        // this is done cause the nextjs app or pages dir is selected by a frontendNext option and not hte frontend option,
        // whereas everywhere else in the code, we check based on frontend option.
        _answers.frontend = _answers.frontendNext;
    }
    if (_answers.recipe === "multitenancy") {
        if (_answers.frontend === "react") {
            _answers.frontend = "react-multitenancy";
        } else if (_answers.frontend === "next") {
            _answers.frontend = "next-multitenancy";
        } else if (_answers.frontend === "next-app-directory") {
            _answers.frontend = "next-app-directory-multitenancy";
        }
    }
    return _answers;
}
export function modifyAnswersBasedOnFlags(answers, userArguments) {
    let _answers = answers;
    if (userArguments.appname !== undefined) {
        _answers.appname = userArguments.appname;
    }
    if (userArguments.recipe !== undefined) {
        _answers.recipe = userArguments.recipe;
    }
    if (userArguments.frontend !== undefined) {
        const selectedFrontend = allFrontends.filter((i) => userArguments.frontend === i.id);
        if (selectedFrontend.length === 0) {
            throw new Error("Should never come here");
        }
        _answers.frontend = selectedFrontend[0].id;
    }
    if (userArguments.backend !== undefined) {
        const selectedBackend = allBackends.find(
            (b) => b.id === userArguments.backend || b.frameworks?.some((f) => f.id === userArguments.backend)
        );
        const backendValue =
            selectedBackend?.id === userArguments.backend
                ? selectedBackend.id
                : selectedBackend?.frameworks?.find((f) => f.id === userArguments.backend)?.id;
        if (!backendValue) {
            throw new Error("Invalid backend specified");
        }
        _answers.backend = backendValue;
    }
    return _answers;
}
export function getShouldAutoStartFromArgs(userArguments) {
    if (
        userArguments.autostart !== undefined &&
        (userArguments.autostart === "true" || userArguments.autostart === true)
    ) {
        return true;
    }
    return false;
}

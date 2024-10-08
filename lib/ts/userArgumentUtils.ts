import {
    allBackends,
    allFrontends,
    allPackageManagers,
    allRecipes,
    Answers,
    isValidBackend,
    isValidFrontend,
    isValidPackageManager,
    isValidRecipeName,
    UIBuildType,
    UserFlags,
    UserFlagsRaw,
} from "./types.js";
import validateProjectName from "validate-npm-package-name";
import path from "path";
import { isValidUiType } from "./filterChoicesUtils.js";

export function validateNpmName(name: string): {
    valid: boolean;
    problems?: string[];
} {
    const nameValidation = validateProjectName(name);
    if (nameValidation.validForNewPackages) {
        return { valid: true };
    }

    return {
        valid: false,
        problems: [...(nameValidation.errors || []), ...(nameValidation.warnings || [])],
    };
}

export function validateFolderName(name: string): {
    valid: boolean;
    problems?: string[] | undefined;
} {
    return validateNpmName(path.basename(path.resolve(name)));
}

export function validateUserArguments(userArguments: UserFlagsRaw) {
    if (userArguments.dashboardDemo !== undefined) {
        if (userArguments.dashboardDemo !== "true") {
            throw new Error("When using --dashboardDemo, please always set the value to true");
        }
        return;
    }
    if (userArguments.appname !== undefined) {
        const validation = validateFolderName(userArguments.appname);

        if (validation.valid !== true) {
            throw new Error("Invalid project name: " + validation.problems![0]);
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
            const availableManagers: string = allPackageManagers.map((e) => `    - ${e}`).join("\n");
            throw new Error("Invalid package manager provided, valid values:\n" + availableManagers);
        }
    }

    if (userArguments.ui !== undefined) {
        if (!isValidUiType(userArguments)) {
            throw new Error(
                `Invalid UI type provided, valid values: ${Object.values(UIBuildType).join(
                    ", "
                )} or provided frontend or recipe is not compatible with the UI type`
            );
        }
    }
}

export function modifyAnswersBasedOnSelection(answers: Answers): Answers {
    let _answers = answers;

    if ("frontendNext" in _answers) {
        // this is done cause the nextjs app or pages dir is selected by a frontendNext option and not hte frontend option,
        // whereas everywhere else in the code, we check based on frontend option.
        (_answers as any).frontend = (_answers as any).frontendNext;
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

export function generateInitialAnswers(userArguments: UserFlags): Partial<Answers> {
    let _answers: Partial<Answers> = {};

    if (userArguments.appname !== undefined) {
        _answers.appname = userArguments.appname;
    }

    if (userArguments.recipe !== undefined) {
        _answers.recipe = userArguments.recipe;
    }

    if (userArguments.ui !== undefined) {
        _answers.ui = userArguments.ui;
    }

    if (userArguments.frontend !== undefined) {
        const selectedFrontend = allFrontends.filter((i) => userArguments.frontend === i.id);

        if (selectedFrontend.length === 0) {
            throw new Error("Should never come here");
        }

        _answers.frontend = selectedFrontend[0].id;
    }

    if (userArguments.backend !== undefined) {
        const selectedBackend = allBackends.filter((i) => userArguments.backend === i.id);

        if (selectedBackend.length === 0) {
            throw new Error("Should never come here");
        }

        _answers.backend = selectedBackend[0].id;
    }

    return _answers;
}

export function getShouldAutoStartFromArgs(userArguments: UserFlags): boolean {
    if (
        userArguments.autostart !== undefined &&
        (userArguments.autostart === "true" || userArguments.autostart === true)
    ) {
        return true;
    }

    return false;
}

export function modifyUserArgumentsForAliasFlags(userArguments: UserFlagsRaw): UserFlagsRaw {
    let _userArguments = structuredClone(userArguments);

    if (_userArguments.ui === UIBuildType.CUSTOM && _userArguments.frontend === "react") {
        _userArguments.frontend = "react-custom";
    }

    return _userArguments;
}

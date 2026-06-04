import {
    allBackends, // Add SupportedFrontends
    allFrontends, // Re-add allFrontends
    allPackageManagers,
    allRecipes,
    isValidBackend,
    isValidFrontend, // Re-add isValidFrontend
    isValidPackageManager,
    isValidRecipeName,
} from "./types.js";
import validateProjectName from "validate-npm-package-name";
import path from "path";
import { thirdPartyLoginProviders } from "../../boilerplate/backend/shared/config/oAuthProviders.js";
// Remove getFrontendOptionsForProcessing import
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
    // Make sync again
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
        // Normalize aliases before validation
        const frontendAliases = {
            vuejs: "vue",
            nuxt: "nuxtjs",
            solidjs: "solid",
            nextjs: "next",
            "next-pages-directory": "next",
            "next-app-dir": "next-app-directory",
            "next-pages-router": "next",
            "next-app-router": "next-app-directory",
        };
        const normalizedFrontend = frontendAliases[userArguments.frontend] || userArguments.frontend;
        if (!isValidFrontend(normalizedFrontend)) {
            const availableFrontends = allFrontends.map((e) => `    - ${e.id}`).join("\n");
            throw new Error("Invalid frontend provided, valid values:\n" + availableFrontends);
        }
    }
    if (userArguments.backend !== undefined) {
        // Normalize backend aliases/frameworks
        const backendAliases = {
            fastapi: "python-fastapi",
            flask: "python-flask",
            drf: "python-drf",
            koa: "koa",
            express: "express",
            nest: "nest",
        };
        const normalizedBackend = backendAliases[userArguments.backend] || userArguments.backend;
        if (!isValidBackend(normalizedBackend)) {
            const availableBackends = allBackends
                .flatMap((b) => [b.id, ...(b.frameworks?.map((f) => f.id) || [])])
                .map((e) => `    - ${e}`)
                .join("\n");
            throw new Error(
                `Invalid backend provided: "${userArguments.backend}". Valid values:\n${availableBackends}`
            );
        }
        userArguments.backend = normalizedBackend;
    }
    if (userArguments.manager !== undefined) {
        if (!isValidPackageManager(userArguments.manager)) {
            const availableManagers = allPackageManagers.map((e) => `    - ${e}`).join("\n");
            throw new Error("Invalid package manager provided, valid values:\n" + availableManagers);
        }
    }
    if (userArguments.firstfactors !== undefined) {
        console.log("Validating firstfactors:", userArguments.firstfactors);
        const validFirstFactors = [
            "emailpassword",
            "thirdparty",
            "otp-phone",
            "otp-email",
            "link-phone",
            "link-email",
            "webauthn",
        ];
        const invalidFactors = userArguments.firstfactors.filter((factor) => !validFirstFactors.includes(factor));
        console.log("Invalid factors:", invalidFactors);
        if (invalidFactors.length > 0) {
            throw new Error(
                `Invalid first factors provided: ${invalidFactors.join(
                    ", "
                )}. Valid values are: ${validFirstFactors.join(", ")}`
            );
        }
    }
    if (userArguments.secondfactors !== undefined) {
        const validSecondFactors = ["otp-phone", "otp-email", "link-phone", "link-email", "totp"];
        const invalidFactors = userArguments.secondfactors.filter((factor) => !validSecondFactors.includes(factor));
        if (invalidFactors.length > 0) {
            throw new Error(
                `Invalid second factors provided: ${invalidFactors.join(
                    ", "
                )}. Valid values are: ${validSecondFactors.join(", ")}`
            );
        }
    }
    if (userArguments.providers !== undefined) {
        validateProviders(userArguments.providers);
    }
}
function validateProviders(providers) {
    const validProviderIds = thirdPartyLoginProviders.map((p) => p.id);
    const invalidProviders = providers.filter((provider) => !validProviderIds.includes(provider));
    if (invalidProviders.length > 0) {
        throw new Error(
            `Invalid providers provided: ${invalidProviders.join(", ")}. Valid values are: ${validProviderIds.join(
                ", "
            )}`
        );
    }
}
export function modifyAnswersBasedOnSelection(answers) {
    let _answers = answers;
    if ("frontendNext" in _answers) {
        // this is done cause the nextjs app or pages dir is selected by a frontendNext option and not hte frontend option,
        // whereas everywhere else in the code, we check based on frontend option.
        _answers.frontend = _answers.frontendNext;
    }
    // Removed deprecated logic that mapped to specific -multitenancy boilerplates
    return _answers;
}
export function modifyAnswersBasedOnFlags(answers, userArguments) {
    let _answers = answers;
    if (userArguments.appname !== undefined) {
        _answers.appname = userArguments.appname;
    }
    if (userArguments.recipe !== undefined) {
        _answers.recipe = userArguments.recipe;
    } else if (userArguments.firstfactors !== undefined || userArguments.secondfactors !== undefined) {
        // Convert factors to recipe
        if (
            userArguments.firstfactors?.includes("emailpassword") &&
            userArguments.firstfactors?.includes("thirdparty")
        ) {
            _answers.recipe = "thirdpartyemailpassword";
        } else if (userArguments.firstfactors?.includes("emailpassword")) {
            _answers.recipe = "emailpassword";
        } else if (userArguments.firstfactors?.includes("thirdparty")) {
            _answers.recipe = "thirdparty";
        } else if (
            userArguments.firstfactors?.includes("link-email") &&
            userArguments.firstfactors?.includes("link-phone")
        ) {
            _answers.recipe = "passwordless";
        } else if (userArguments.firstfactors?.includes("link-email")) {
            _answers.recipe = "passwordless";
        } else if (userArguments.firstfactors?.includes("link-phone")) {
            _answers.recipe = "passwordless";
        } else if (
            userArguments.firstfactors?.includes("otp-email") &&
            userArguments.firstfactors?.includes("otp-phone")
        ) {
            _answers.recipe = "passwordless";
        } else if (userArguments.firstfactors?.includes("otp-email")) {
            _answers.recipe = "passwordless";
        } else if (userArguments.firstfactors?.includes("otp-phone")) {
            _answers.recipe = "passwordless";
        } else if (userArguments.secondfactors !== undefined) {
            _answers.recipe = "multifactorauth";
        }
    }
    // If frontend is provided via arguments, directly assign it to answers.
    // Validation is handled earlier in validateUserArguments.
    if (userArguments.frontend !== undefined) {
        _answers.frontend = userArguments.frontend;
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

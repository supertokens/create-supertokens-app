import os from "os";
import { UIBuildType } from "./types.js";
export function getPythonRunScripts() {
    if (os.platform() === "win32") {
        return [
            "pip install virtualenv",
            "python -m virtualenv venv",
            ".\\\\venv\\\\Scripts\\\\activate.bat",
            "pip install -r requirements.txt",
            "python app.py",
        ];
    }
    return [
        "pip install virtualenv",
        "virtualenv venv",
        "chmod +x venv/bin/activate",
        ". venv/bin/activate",
        "pip install -r requirements.txt",
        "python app.py",
    ];
}
export function getDjangoPythonRunScripts() {
    if (os.platform() === "win32") {
        return [
            "pip install virtualenv",
            "python -m virtualenv venv",
            ".\\\\venv\\\\Scripts\\\\activate.bat",
            "pip install -r requirements.txt",
            "python manage.py runserver",
        ];
    }
    return [
        "pip install virtualenv",
        "virtualenv venv",
        "chmod +x venv/bin/activate",
        ". venv/bin/activate",
        "pip install -r requirements.txt",
        "python manage.py runserver",
    ];
}
// Converts the options array we declare to a format inquirer can use
export function mapOptionsToChoices(options) {
    return options
        .filter((i) => i.shouldDisplay !== false)
        .map((option) => {
            return {
                name: option.displayName,
                value: option.value,
            };
        });
}
/**
 * This modifies the answers hash to use the correct python framework id if the user selects python
 * for their backend
 */
export function modifyAnswersForPythonFrameworks(answers) {
    let _answers = answers;
    if (answers.backend === "python") {
        _answers.backend = answers.backendPython;
    }
    return _answers;
}
/**
 * Decides whether the user should be prompted to select their backend.This question is skipped for full stack frameworks
 */
export function shouldSkipBackendQuestion(answers, userFlags) {
    if (userFlags.backend !== undefined) {
        return true;
    }
    let frontEndInFlags = userFlags.frontend;
    if (frontEndInFlags !== undefined) {
        // Priority goes to flags
        return (
            frontEndInFlags.startsWith("next") ||
            frontEndInFlags === "capacitor" ||
            frontEndInFlags === "remix" ||
            frontEndInFlags === "astro" ||
            frontEndInFlags === "sveltekit" ||
            frontEndInFlags === "nuxtjs"
        );
    }
    return (
        (answers.frontend !== undefined && answers.frontend.startsWith("next")) ||
        answers.frontend === "capacitor" ||
        answers.frontend === "remix" ||
        answers.frontend === "astro" ||
        answers.frontend === "sveltekit" ||
        answers.frontend === "nuxtjs"
    );
}
export function getFrontendPromptMessage(answers) {
    if (answers.ui === UIBuildType.CUSTOM) {
        return (
            "Pick a frontend framework. For other frameworks, check the docs or" +
            " select 'Pre-built UI' in the previous 'UI Build Type' step."
        );
    }
    return "Choose a frontend framework (Visit our documentation for integration with other frameworks):";
}
export function getRecipePromptMessage(answers) {
    if (answers.ui === UIBuildType.CUSTOM) {
        return (
            "What type of authentication do you want to use?. For other methods, check the docs or select 'Pre-built UI'" +
            " in the previous 'UI Build Type' step."
        );
    }
    return "What type of authentication do you want to use?";
}

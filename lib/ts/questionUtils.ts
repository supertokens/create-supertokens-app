import os from "os";
import { Answers, QuestionOption, RecipeQuestionOption, UserFlags } from "./types.js";

export function getPythonRunScripts(): string[] {
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

export function getDjangoPythonRunScripts(): string[] {
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
export function mapOptionsToChoices(options: QuestionOption[] | RecipeQuestionOption[]) {
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
export function modifyAnswersForPythonFrameworks(answers: Answers) {
    let _answers = answers;

    if (answers.backend === "python") {
        _answers.backend = answers.backendPython;
    }

    return _answers;
}

export function modifyAnswersForNodeJSFrameworks(answers: Answers) {
    let _answers = answers;
    if (answers.backend === "node") {
        _answers.backend = answers.backendNodeJS;
    }
    return _answers;
}

/**
 * Decides whether the user should be prompted to select their backend.This question is skipped for full stack frameworks
 */
export function shouldSkipBackendQuestion(answers: Answers, userFlags: UserFlags): boolean {
    let frontEndInFlags = userFlags.frontend;

    if (frontEndInFlags !== undefined) {
        // Priority goes to flags
        return (
            frontEndInFlags.startsWith("next") ||
            frontEndInFlags === "capacitor" ||
            frontEndInFlags === "remix" ||
            frontEndInFlags === "astro-react" ||
            frontEndInFlags === "sveltekit" ||
            frontEndInFlags === "nuxtjs"
        );
    }

    return (
        (answers.frontend !== undefined && answers.frontend.startsWith("next")) ||
        answers.frontend === "capacitor" ||
        answers.frontend === "remix" ||
        answers.frontend === "astro-react" ||
        answers.frontend === "sveltekit" ||
        answers.frontend === "nuxtjs"
    );
}

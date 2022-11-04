import os from "os";
import { Answers, QuestionOption, RecipeQuestionOption } from "./types.js";

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

// Converts the options array we declare to a format iquirer can use
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

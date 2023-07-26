import os from "os";
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
// Converts the options array we declare to a format iquirer can use
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
        return frontEndInFlags === "next" || frontEndInFlags === "capacitor";
    }
    return answers.frontend === "next" || answers.frontend === "capacitor";
}

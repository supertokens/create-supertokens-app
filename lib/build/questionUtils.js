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
        "source venv/bin/activate",
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
        "source venv/bin/activate",
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

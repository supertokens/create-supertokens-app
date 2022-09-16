import os from "os";
import { QuestionOption, RecipeQuestionOption } from "./types.js";

export function getPythonRunScripts(): string[] {
    if (os.platform() === "win32") {
        return [
            "pip install virtualenv",
            "python -m virtualenv flask_example",
            ".\\\\flask_example\\\\Scripts\\\\activate.bat",
            "pip install -r requirements.txt",
            "python app.py",
        ];
    }
    return ["./create_env.sh", "python app.py"];
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

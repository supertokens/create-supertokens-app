import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { Answers, QuestionOption } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function executeSetupScript(scriptPath: string, directoryPath: string, answers: Answers): Promise<void> {
    const scriptUrl = pathToFileURL(scriptPath).href;
    const script = await import(scriptUrl);
    await script.default(directoryPath, answers);
}

export async function executeSetupScriptIfExists(
    selectedStack: QuestionOption,
    directoryPath: string,
    answers: Answers
): Promise<void> {
    const setupScriptPath = path.join(__dirname, `./setup-scripts/${selectedStack.location.main}.js`);
    if (fs.existsSync(setupScriptPath)) {
        await executeSetupScript(setupScriptPath, directoryPath, answers);
    }
}

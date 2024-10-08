import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function executeSetupScript(scriptPath, answers) {
    const scriptUrl = pathToFileURL(scriptPath).href;
    const script = await import(scriptUrl);
    await script.default(answers);
}
export async function executeSetupScriptIfExists(selectedStack, answers) {
    const setupScriptPath = path.join(__dirname, `./setup-scripts/${selectedStack.location.main}.js`);
    if (fs.existsSync(setupScriptPath)) {
        await executeSetupScript(setupScriptPath, answers);
    }
}

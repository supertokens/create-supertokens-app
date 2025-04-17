import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { setupProject } from "../lib/ts/utils";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BOILERPLATE_DIR = path.join(__dirname, "..", "boilerplate");
function copyDir(src, dest, filter) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (filter && !filter(srcPath)) {
            continue;
        }
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath, filter);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}
function getTempDirName(location) {
    const parts = location.split("/");
    if (location.includes("backend/")) {
        const [_, framework, name] = parts;
        if (framework === "typescript") {
            return "typescript" + name;
        }
        if (framework === "python") {
            return "python" + name;
        }
        if (framework === "go") {
            return "go" + name;
        }
        return name;
    }
    return parts[parts.length - 1];
}
function getLocalTemplatePath(location) {
    const normalizedPath = location.replace(/^\//, "");
    return path.join(BOILERPLATE_DIR, normalizedPath);
}
export async function downloadAppLocally(locations, folderName) {
    if (process.env.DEBUG === "true") {
        console.log("\nDebug: Input locations");
        console.log("Frontend location:", locations.frontend);
        console.log("Backend location:", locations.backend);
    }
    const projectDir = path.resolve(folderName);
    if (fs.existsSync(projectDir)) {
        throw new Error(`A folder with name "${folderName}" already exists`);
    }
    fs.mkdirSync(projectDir);
    const isFullStack = locations.frontend === locations.backend;
    if (isFullStack) {
        if (locations.frontend.startsWith("http://") || locations.frontend.startsWith("https://")) {
            throw new Error(
                `Cannot use local scaffolding for external template URL: ${locations.frontend}. Please run without USE_LOCAL_TEMPLATES=true.`
            );
        }
        const templatePath = getLocalTemplatePath(locations.frontend);
        copyDir(templatePath, projectDir);
        if (process.env.DEBUG === "true") {
            console.log("\nDebug: Template paths (fullstack)");
            console.log("Template source:", templatePath);
            console.log("Project directory:", projectDir);
        }
    } else {
        if (locations.frontend.startsWith("http://") || locations.frontend.startsWith("https://")) {
            throw new Error(
                `Cannot use local scaffolding for external template URL: ${locations.frontend}. Please run without USE_LOCAL_TEMPLATES=true.`
            );
        }
        if (locations.backend.startsWith("http://") || locations.backend.startsWith("https://")) {
            throw new Error(
                `Cannot use local scaffolding for external template URL: ${locations.backend}. Please run without USE_LOCAL_TEMPLATES=true.`
            );
        }
        const frontendSrc = getLocalTemplatePath(locations.frontend);
        const backendSrc = getLocalTemplatePath(locations.backend);
        if (process.env.DEBUG === "true") {
            console.log("\nDebug: Template paths");
            console.log("Frontend source:", frontendSrc);
            console.log("Backend source:", backendSrc);
        }
        const frontendTempName = getTempDirName(locations.frontend);
        const backendTempName = getTempDirName(locations.backend);
        const frontendTempDir = path.join(projectDir, frontendTempName);
        const backendTempDir = path.join(projectDir, backendTempName);
        copyDir(frontendSrc, frontendTempDir);
        copyDir(backendSrc, backendTempDir);
        if (process.env.DEBUG === "true") {
            console.log("\nDebug: Final paths");
            console.log("Project directory:", projectDir);
            console.log("Frontend temp dir:", frontendTempDir);
            console.log("Backend temp dir:", backendTempDir);
            console.log("Expected frontend dir:", path.join(projectDir, "frontend"));
            console.log("Expected backend dir:", path.join(projectDir, "backend"));
        }
    }
}
export async function setupProjectLocally(locations, folderName, answers, userArguments, spinner) {
    await downloadAppLocally(locations, folderName);
    await setupProject(locations, folderName, answers, userArguments, spinner);
}
export function shouldUseLocalTemplates() {
    return process.env.USE_LOCAL_TEMPLATES === "true";
}
export function getLocalPrebuiltUIBundleUrl() {
    const localBundlePath = process.env.LOCAL_PREBUILT_UI_PATH;
    if (localBundlePath && fs.existsSync(localBundlePath)) {
        return `file://${localBundlePath}`;
    }
    return undefined;
}
export async function downloadAppFromLocal(folderLocations, appname) {
    try {
        await downloadAppLocally(folderLocations, appname);
    } catch (e) {
        fs.rmSync(`${appname}/`, {
            recursive: true,
            force: true,
        });
        throw e;
    }
}

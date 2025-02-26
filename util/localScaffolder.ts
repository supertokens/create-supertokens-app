import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Answers, DownloadLocations, UserFlags } from "../lib/ts/types";
import { setupProject } from "../lib/ts/utils";
import { Ora } from "ora";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BOILERPLATE_DIR = path.join(__dirname, "..", "boilerplate");

/**
 * Recursively copy a directory
 */
function copyDir(src: string, dest: string, filter?: (path: string) => boolean) {
    // Create the destination directory if it doesn't exist
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        // If filter is provided, check if this path should be included
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

/**
 * Get the temporary directory name that utils.ts expects
 */
function getTempDirName(location: string): string {
    const parts = location.split("/");

    // Handle backend paths
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

    // For frontend, just use the last part
    return parts[parts.length - 1];
}

/**
 * Get the correct local template path based on framework selection
 */
function getLocalTemplatePath(location: string): string {
    // Remove any leading slashes
    const normalizedPath = location.replace(/^\//, "");

    // Join with the boilerplate directory
    return path.join(BOILERPLATE_DIR, normalizedPath);
}

/**
 * Local alternative to downloadApp from utils.ts
 * This copies files from local boilerplate directory instead of downloading from GitHub
 */
export async function downloadAppLocally(locations: DownloadLocations, folderName: string): Promise<void> {
    if (process.env.DEBUG === "true") {
        console.log("\nDebug: Input locations");
        console.log("Frontend location:", locations.frontend);
        console.log("Backend location:", locations.backend);
    }

    const projectDir = path.resolve(folderName);

    // If the folder already exists, throw error
    if (fs.existsSync(projectDir)) {
        throw new Error(`A folder with name "${folderName}" already exists`);
    }

    // Create the project directory
    fs.mkdirSync(projectDir);

    const isFullStack = locations.frontend === locations.backend;

    if (isFullStack) {
        // For fullstack, copy the entire template directory
        const templatePath = getLocalTemplatePath(locations.frontend);
        copyDir(templatePath, projectDir);

        // Log paths in debug mode
        if (process.env.DEBUG === "true") {
            console.log("\nDebug: Template paths (fullstack)");
            console.log("Template source:", templatePath);
            console.log("Project directory:", projectDir);
        }
    } else {
        // For separate frontend/backend, copy respective directories
        const frontendSrc = getLocalTemplatePath(locations.frontend);
        const backendSrc = getLocalTemplatePath(locations.backend);

        if (process.env.DEBUG === "true") {
            console.log("\nDebug: Template paths");
            console.log("Frontend source:", frontendSrc);
            console.log("Backend source:", backendSrc);
        }

        // Create temporary directories with the expected names
        const frontendTempName = getTempDirName(locations.frontend);
        const backendTempName = getTempDirName(locations.backend);

        const frontendTempDir = path.join(projectDir, frontendTempName);
        const backendTempDir = path.join(projectDir, backendTempName);

        // Copy files to temporary directories
        copyDir(frontendSrc, frontendTempDir);
        copyDir(backendSrc, backendTempDir);

        // Log paths in debug mode
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

/**
 * Main entry point for local project setup
 * This handles the local file copying and then uses utils.setupProject for the rest
 */
export async function setupProjectLocally(
    locations: DownloadLocations,
    folderName: string,
    answers: Answers,
    userArguments: UserFlags,
    spinner: Ora
): Promise<void> {
    // First copy files locally instead of downloading
    await downloadAppLocally(locations, folderName);

    // Then use the normal setup process from utils.ts
    // This handles all the dependency installation, config setup, etc.
    // The utils.setupProject function will now use compileFullstack for fullstack templates
    await setupProject(locations, folderName, answers, userArguments, spinner);
}

/**
 * Check if we should use local templates instead of network
 * This allows developers to switch between local and network modes easily
 */
export function shouldUseLocalTemplates(): boolean {
    return process.env.USE_LOCAL_TEMPLATES === "true";
}

/**
 * Get the prebuilt UI bundle URL for local development
 */
export function getLocalPrebuiltUIBundleUrl(): string | undefined {
    const localBundlePath = process.env.LOCAL_PREBUILT_UI_PATH;
    if (localBundlePath && fs.existsSync(localBundlePath)) {
        return `file://${localBundlePath}`;
    }
    return undefined;
}

/**
 * Alternative to downloadAppFromGithub that uses local templates
 */
export async function downloadAppFromLocal(folderLocations: DownloadLocations, appname: string): Promise<void> {
    try {
        await downloadAppLocally(folderLocations, appname);
    } catch (e) {
        /**
         * If the project download failed we want to clear the generated app,
         * otherwise the retrying logic would fail because there would already be
         * a folder with the app name
         */
        fs.rmSync(`${appname}/`, {
            recursive: true,
            force: true,
        });
        throw e;
    }
}

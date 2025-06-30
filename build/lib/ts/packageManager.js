import { isValidPackageManager } from "./types.js";
import whichPMRuns from "which-pm-runs";
export function inferredPackageManager() {
    const packageManager = whichPMRuns();
    const packageManagerName = packageManager?.name;
    if (packageManagerName && isValidPackageManager(packageManagerName)) {
        return packageManagerName;
    }
    return undefined;
}
export function addPackageCommand(packageManager) {
    switch (packageManager) {
        case "bun":
            return "bun add";
        case "yarn":
            return "yarn add";
        case "pnpm":
            return "pnpm add";
        case "npm":
            return "npm i";
    }
}

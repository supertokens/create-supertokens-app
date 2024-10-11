import { Answers, UIBuildType } from "./types.js";
import fs from "fs/promises";
import path from "path";

export async function executeSetupScriptIfExists(directoryPath: string, answers: Answers): Promise<void> {
    if (answers.ui === UIBuildType.CUSTOM && answers.frontend === "react-custom") {
        await modifyDirectoryCustomReact(directoryPath, answers);
    }
}

async function modifyDirectoryCustomReact(frontendDir: string, answers: Answers): Promise<void> {
    const recipe = answers.recipe;
    const authPath = path.join(frontendDir, "src/pages/Auth");
    const allItems = await fs.readdir(authPath);

    /**
     * Verify if the recipe folder exists
     */
    const recipeFolder = allItems.filter((item) => item !== recipe);
    if (!recipeFolder || recipeFolder.length === 0) {
        throw new Error("recipe folder not found");
    }

    /**
     * Get Recipe Dependencies which would be injected into the recipe folder
     * Step1: check if the dependency Exists
     * Step2: Remove existing folder with the dependency name from the recipe folder
     * Step3: Copy the dependency folder from the Auth folder to the recipe folder
     */
    const dependencies = getRecipeDependencies(recipe);
    for (const dependency of dependencies) {
        if (!allItems.includes(dependency)) {
            throw new Error(`Dependency ${dependency} not found`);
        }
        const dependencyPath = path.join(authPath, dependency);
        const recipeDependencyPath = path.join(authPath, recipe, dependency);
        await fs.rm(recipeDependencyPath, { recursive: true });
        await fs.cp(dependencyPath, recipeDependencyPath, { recursive: true });
    }

    /**
     * Remove all the folders except the recipe folder
     */
    for (const item of allItems) {
        if (item === recipe) {
            continue;
        }
        const itemPath = path.join(authPath, item);
        await fs.rm(itemPath, { recursive: true });
    }

    /**
     * Move all the files from the recipe folder to Auth folder
     */
    const allItemsInsideRecipe = await fs.readdir(path.join(authPath, recipe));
    for (const item of allItemsInsideRecipe) {
        const itemPath = path.join(authPath, recipe, item);
        const newPath = path.join(authPath, item);
        await fs.cp(itemPath, newPath, { recursive: true });
    }

    /**
     * Remove the recipe folder as part of cleanup
     */
    await fs.rm(path.join(authPath, recipe), { recursive: true });
}

export function getRecipeDependencies(recipe: string): string[] {
    const recipeDependencies: Record<string, string[]> = {
        thirdpartyemailpassword: ["thirdparty", "emailpassword"],
        thirdpartypasswordless: ["thirdparty", "passwordless"],
    };
    return recipeDependencies?.[recipe] || [];
}

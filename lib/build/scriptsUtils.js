import { UIBuildType } from "./types.js";
import fs from "fs/promises";
import path from "path";
export async function executeSetupScriptIfExists(directoryPath, answers) {
    if (answers.ui === UIBuildType.CUSTOM && answers.frontend === "react-custom") {
        await modifyDirectoryCustomReact(directoryPath, answers);
    }
}
async function modifyDirectoryCustomReact(frontendDir, answers) {
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

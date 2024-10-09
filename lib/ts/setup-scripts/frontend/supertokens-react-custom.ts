import { Answers } from "../../types";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath, pathToFileURL } from "url";

export default async function main(frontendDirectory: string, answers: Answers) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const frontendDir = path.join(__dirname, "../../../../", frontendDirectory);
    const recipe = answers.recipe;
    const authPath = path.join(frontendDir, "src/pages/Auth");
    const allItems = await fs.readdir(authPath);
    const recipeFolder = allItems.filter((item) => item !== recipe);
    if (!recipeFolder || recipeFolder.length === 0) {
        throw new Error("recipe folder not found");
    }
    for (const item of allItems) {
        if (item === recipe) {
            continue;
        }
        const itemPath = path.join(authPath, item);
        await fs.rm(itemPath, { recursive: true });
    }

    const allItemsInsideRecipe = await fs.readdir(path.join(authPath, recipe));

    // Move the files to Auth folder
    for (const item of allItemsInsideRecipe) {
        const itemPath = path.join(authPath, recipe, item);
        const newPath = path.join(authPath, item);
        await fs.cp(itemPath, newPath);
    }
    await fs.rm(path.join(authPath, recipe), { recursive: true });
}

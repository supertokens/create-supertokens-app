#!/usr/bin/env node
import inquirer from "inquirer";
import { questions } from "./config.js";
import { allRecipes, isValidRecipeName } from "./types.js";
import { getDownloadLocationFromAnswers, downloadApp, setupProject, validateFolderName } from "./utils.js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
async function showPropt() {
    try {
        /*
        userArguments will contain all the arguments the user passes
        For example: `npx create-supertokens-app --recipe=emailpassword` will result
        in userArguments.recipe === "emailpassword"

        Avalaible flags:
        --name: App name
        --recipe: Auth mechanism
    */
        const userArguments = await yargs(hideBin(process.argv)).argv;
        // Inquirer prompts all the questions to the user, answers will be an object that contains all the responses
        const answers = await inquirer.prompt(questions);
        if (userArguments.name !== undefined) {
            const validation = validateFolderName(userArguments.name);
            if (validation.valid !== true) {
                throw new Error("Invalid project name: " + validation.problems[0]);
            }
            answers.appname = userArguments.name;
        }
        if (userArguments.recipe !== undefined) {
            if (!isValidRecipeName(userArguments.recipe)) {
                const availableRecipes = allRecipes.map(e => `    - ${e}`).join("\n");
                throw new Error("Invalid recipe name provided, valid values:\n" + availableRecipes + "\n");
            }
            answers.recipe = userArguments.recipe;
        }
        if (answers.confirmation !== true) {
            return;
        }
        const folderLocations = getDownloadLocationFromAnswers(answers);
        if (folderLocations === undefined) {
            console.log("Something went wrong, exiting...");
            return;
        }
        await downloadApp(folderLocations, answers.appname);
        await setupProject(folderLocations, answers.appname, answers);
    }
    catch (e) {
        console.log(e.message);
    }
}
showPropt();

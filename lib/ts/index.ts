#!/usr/bin/env node
import inquirer from "inquirer";
import { getQuestions } from "./config.js";
import { allRecipes, Answers, isValidRecipeName, UserFlags } from "./types.js";
import { getDownloadLocationFromAnswers, downloadApp, setupProject, validateFolderName, runProject } from "./utils.js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

async function run() {
    try {
        /* 
            userArguments will contain all the arguments the user passes
            For example: `npx create-supertokens-app --recipe=emailpassword` will result
            in userArguments.recipe === "emailpassword"

            Avalaible flags:
            --appname: App name
            --recipe: Auth mechanism
        */
        const userArguments: UserFlags = await yargs(hideBin(process.argv)).argv as any;

        // Inquirer prompts all the questions to the user, answers will be an object that contains all the responses
        const answers: Answers = await inquirer.prompt(getQuestions(userArguments));

        if (userArguments.appname !== undefined) {
            const validation = validateFolderName(userArguments.appname);

            if (validation.valid !== true) {
                throw new Error("Invalid project name: " + validation.problems![0])
            }
            
            answers.appname = userArguments.appname;
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
            console.log("Something went wrong, exiting...")
            return;
        }

        await downloadApp(folderLocations, answers.appname);

        console.log("Setting up the project...")
        await setupProject(folderLocations, answers.appname, answers);

        console.log("Running the project...")
        await runProject(answers.appname);
    } catch (e) {
        console.log((e as any).message);
    }
}

run();
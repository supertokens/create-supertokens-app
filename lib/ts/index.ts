#!/usr/bin/env node
import inquirer from "inquirer";
import { getQuestions } from "./config.js";
import { allRecipes, Answers, isValidRecipeName, UserFlags } from "./types.js";
import { getDownloadLocationFromAnswers, downloadApp, setupProject, validateFolderName, runProject } from "./utils.js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

function modifyAnswersBasedOnFlags(answers: Answers, userArguments: UserFlags): Answers {
    let _answers = answers;

    if (userArguments.appname !== undefined) {
        const validation = validateFolderName(userArguments.appname);

        if (validation.valid !== true) {
            throw new Error("Invalid project name: " + validation.problems![0])
        }
        
        _answers.appname = userArguments.appname;
    }

    if (userArguments.recipe !== undefined) {
        if (!isValidRecipeName(userArguments.recipe)) {
            const availableRecipes = allRecipes.map(e => `    - ${e}`).join("\n");
            throw new Error("Invalid recipe name provided, valid values:\n" + availableRecipes + "\n");
        }

        _answers.recipe = userArguments.recipe;
    }

    return _answers;
}

function modifyAnswersBasedOnSelection(answers: Answers): Answers {
    let _answers = answers;

    if (answers.nextfullstack === true) {
        _answers.frontend = "next-fullstack";
    }

    return _answers;
}

async function run() {
    try {
        /* 
            userArguments will contain all the arguments the user passes
            For example: `npx create-supertokens-app --recipe=emailpassword` will result
            in userArguments.recipe === "emailpassword"

            Avalaible flags:
            --appname: App name
            --recipe: Auth mechanism
            --branch: Which branch to use when downloading from github (defaults to master)
        */
        const userArguments: UserFlags = await yargs(hideBin(process.argv)).argv as any;

        // Inquirer prompts all the questions to the user, answers will be an object that contains all the responses
        let answers: Answers = await inquirer.prompt(getQuestions(userArguments));

        answers = modifyAnswersBasedOnFlags(answers, userArguments);
        answers = modifyAnswersBasedOnSelection(answers);

        if (answers.confirmation !== true) {
            return;
        }

        const folderLocations = getDownloadLocationFromAnswers(answers, userArguments);

        if (folderLocations === undefined) {
            console.log("Something went wrong, exiting...")
            return;
        }

        await downloadApp(folderLocations, answers.appname);

        console.log("Setting up the project...")
        await setupProject(folderLocations, answers.appname, answers);

        console.log("Running the project...")
        await runProject(answers);
    } catch (e) {
        console.log((e as any).message);
    }
}

run();
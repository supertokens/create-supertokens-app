#!/usr/bin/env node
import inquirer from "inquirer";
import { questions } from "./config.js";
import { getFolderCombinationFromAnswers, downloadApp } from "./utils.js";

async function showPropt() {
    // Inquirer prompts all the questions to the user, answers will be an object that contains all the responses
    const answers = await inquirer.prompt(questions);

    if (answers.confirmation !== true) {
        return;
    }

    const folderLocations = getFolderCombinationFromAnswers(answers);

    if (folderLocations === undefined) {
        console.log("Something went wrong, exiting...")
        return;
    }

    console.log(folderLocations);

    downloadApp(folderLocations)
}

showPropt();
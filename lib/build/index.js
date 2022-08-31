#!/usr/bin/env node
import inquirer from "inquirer";
import { questions } from "./config.js";
import { getDownloadLocationFromAnswers, downloadApp } from "./utils.js";
async function showPropt() {
    // Inquirer prompts all the questions to the user, answers will be an object that contains all the responses
    const answers = await inquirer.prompt(questions);
    if (answers.confirmation !== true) {
        return;
    }
    const folderLocations = getDownloadLocationFromAnswers(answers);
    if (folderLocations === undefined) {
        console.log("Something went wrong, exiting...");
        return;
    }
    try {
        await downloadApp(folderLocations);
    }
    catch (e) {
        console.log(e);
    }
}
showPropt();

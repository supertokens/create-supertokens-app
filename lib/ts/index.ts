#!/usr/bin/env node
import inquirer from "inquirer";
import { questions } from "./config.js";
import { Answers } from "./types.js";
import { getDownloadLocationFromAnswers, downloadApp, setupProject } from "./utils.js";
// import yargs from "yargs";
// import { hideBin } from "yargs/helpers";

async function showPropt() {
    /* 
        userArguments will contain all the arguments the user passes
        For example: `npx create-supertokens-app --recipe=emailpassword` will result
        in userArguments.recipe === "emailpassword"
    */
    // const userArguments = yargs(hideBin(process.argv)).argv;

    // console.log(userArguments);

    // Inquirer prompts all the questions to the user, answers will be an object that contains all the responses
    const answers: Answers = await inquirer.prompt(questions);

    if (answers.confirmation !== true) {
        return;
    }

    const folderLocations = getDownloadLocationFromAnswers(answers);

    if (folderLocations === undefined) {
        console.log("Something went wrong, exiting...")
        return;
    }

    try {
        await downloadApp(folderLocations, answers.appname);
        await setupProject(folderLocations, answers.appname, answers);
    } catch (e) {
        console.log(e);
    }
}

showPropt();
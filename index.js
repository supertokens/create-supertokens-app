#!/usr/bin/env node
const chalk = require("chalk");
const inquirer = require("inquirer");
const { questions } = require("./config");
const { getFolderCombinationFromAnswers } = require("./utils");

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
}

showPropt();
#!/usr/bin/env node
import inquirer from "inquirer";
import { getQuestions } from "./config.js";
import { getDownloadLocationFromAnswers, downloadApp, setupProject, runProjectOrPrintStartCommand } from "./utils.js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { modifyAnswersBasedOnFlags, validateUserArguments } from "./userArgumentUtils.js";
import { Logger } from "./logger.js";
import fs from "fs";
import Ora from "ora";
import chalk from "chalk";
import Emoji from "node-emoji";
function modifyAnswersBasedOnSelection(answers) {
    let _answers = answers;
    if (answers.frontend === "next" && answers.nextfullstack === true) {
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
            --frontend: Which frontend to use
            --backend: Which backend to use
            --fullstack: If the selected stack is a fullstack framework
            --autoconfirm: Skips the confirmation at the end of the selection
            --manager: Which package manager to use
            --autostart: Whether the CLI should start the project after setting up
        */
        const userArguments = await yargs(hideBin(process.argv)).argv;
        validateUserArguments(userArguments);
        // Inquirer prompts all the questions to the user, answers will be an object that contains all the responses
        let answers = await inquirer.prompt(await getQuestions(userArguments));
        answers = modifyAnswersBasedOnFlags(answers, userArguments);
        answers = modifyAnswersBasedOnSelection(answers);
        if (answers.confirmation !== true) {
            throw new Error("Aborting...");
        }
        console.log("");
        const downloadSpinner = Ora({
            spinner: "dots10",
            text: "Downloading files",
        }).start();
        const folderLocations = await getDownloadLocationFromAnswers(answers, userArguments);
        if (folderLocations === undefined) {
            Logger.log("Something went wrong, exiting...");
            return;
        }
        try {
            await downloadApp(folderLocations, answers.appname);
            downloadSpinner.stopAndPersist({
                text: chalk.greenBright("Download complete!"),
                symbol: Emoji.get(":white_check_mark:"),
            });
        } catch (e) {
            downloadSpinner.stopAndPersist({
                text: chalk.redBright("Error downloading files"),
                symbol: Emoji.get(":no_entry:"),
            });
        }
        console.log("");
        const setupSpinner = Ora({
            text: "Setting up the project",
            spinner: "dots10",
        }).start();
        try {
            await setupProject(folderLocations, answers.appname, answers, userArguments, setupSpinner);
            setupSpinner.stopAndPersist({
                text: chalk.greenBright("Setup complete!"),
                symbol: Emoji.get(":white_check_mark:"),
            });
        } catch (e) {
            setupSpinner.stopAndPersist({
                text: chalk.redBright("Setup failed!"),
                symbol: Emoji.get(":no_entry:"),
            });
            /**
             * If the project setup failed we want to clear the generate app,
             * otherwise the user would have to manually delete the folder before
             * running the CLI again
             *
             * NOTE: We dont do this for runProject because if running fails, the user
             * can fix the error (install missing library for example) and then run the
             * app again themseves without having to run and wait for the CLI to finish
             */
            fs.rmSync(`${answers.appname}/`, {
                recursive: true,
                force: true,
            });
            throw e;
        }
        await runProjectOrPrintStartCommand(answers, userArguments);
    } catch (e) {
        Logger.error(e.message);
    }
}
run();

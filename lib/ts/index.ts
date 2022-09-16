#!/usr/bin/env node
import inquirer from "inquirer";
import { getQuestions } from "./config.js";
import { Answers, UserFlags } from "./types.js";
import { getDownloadLocationFromAnswers, downloadApp, setupProject, runProject } from "./utils.js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
// import fs from "fs";
import { getShouldAutoStartFromArgs, modifyAnswersBasedOnFlags, validateUserArguments } from "./userArgumentUtils.js";
import { Logger } from "./logger.js";
import fs from "fs";

function modifyAnswersBasedOnSelection(answers: Answers): Answers {
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
        const userArguments: UserFlags = await yargs(hideBin(process.argv)).argv as any;
        validateUserArguments(userArguments);

        // Inquirer prompts all the questions to the user, answers will be an object that contains all the responses
        let answers: Answers = await inquirer.prompt(getQuestions(userArguments));

        answers = modifyAnswersBasedOnFlags(answers, userArguments);
        answers = modifyAnswersBasedOnSelection(answers);

        if (answers.confirmation !== true) {
            throw new Error("Aborting...");
        }

        const folderLocations = getDownloadLocationFromAnswers(answers, userArguments);

        if (folderLocations === undefined) {
            Logger.log("Something went wrong, exiting...")
            return;
        }

        await downloadApp(folderLocations, answers.appname);

        Logger.log("Setting up the project...")
        try {
            await setupProject(folderLocations, answers.appname, answers, userArguments);
        } catch (e) {
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

        if (!getShouldAutoStartFromArgs(userArguments)) {
            Logger.success("Setup complete!")
            return;
        }

        Logger.log("Running the project...")
        await runProject(answers, userArguments);
    } catch (e) {
        Logger.error((e as any).message);
    }
}

run();
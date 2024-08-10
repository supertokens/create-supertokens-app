#!/usr/bin/env node
import inquirer from "inquirer";
import { getQuestions } from "./config.js";
import { getDownloadLocationFromAnswers, downloadApp, setupProject, runProjectOrPrintStartCommand } from "./utils.js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
    modifyAnswersBasedOnFlags,
    modifyAnswersBasedOnSelection,
    validateUserArguments,
} from "./userArgumentUtils.js";
import { Logger } from "./logger.js";
import fs from "fs";
import Ora from "ora";
import chalk from "chalk";
import Emoji from "node-emoji";
import AnalyticsManager from "./analytics.js";
import figlet from "figlet";
import { package_version } from "./version.js";
import { modifyAnswersBasedOnNextJsFramework, modifyAnswersForPythonFrameworks } from "./questionUtils.js";
import { inferredPackageManager } from "./packageManager.js";
async function printInformation() {
    const font = "Doom";
    console.log("\n");
    await new Promise((resolve) => {
        figlet(
            "SuperTokens",
            {
                font,
            },
            (err, data) => {
                if (err === null && data !== undefined) {
                    console.log(data);
                }
                resolve();
            }
        );
    });
    console.log("\n");
    console.log(
        chalk.bold(`create-supertokens-app (v${package_version})`),
        "lets you quickly get started with using SuperTokens!\n"
    );
    console.log(
        "Choose your tech stack and the authentication method, we will create a working project that uses SuperTokens for you."
    );
    console.log("\n");
}
let downLoadRetriesLeft = 2;
async function downloadAppFromGithub(folderLocations, appname) {
    try {
        await downloadApp(folderLocations, appname);
    } catch (e) {
        /**
         * If the project download failed we want to clear the generate app,
         * otherwise the retrying logic would fail because there would already be
         * a folder with the app name
         */
        fs.rmSync(`${appname}/`, {
            recursive: true,
            force: true,
        });
        if (downLoadRetriesLeft === 0) {
            throw e;
        } else {
            downLoadRetriesLeft--;
            await downloadAppFromGithub(folderLocations, appname);
        }
    }
}
async function run() {
    let answers = undefined;
    try {
        await printInformation();
        /*
            userArguments will contain all the arguments the user passes
            For example: `npx create-supertokens-app --recipe=emailpassword` will result
            in userArguments.recipe === "emailpassword"

            Available flags:
            --dashboardDemo: boolean; This is a special flag, which bypasses everything and generates a project just to see the dashboard demo.
            --appname: App name
            --recipe: Auth mechanism
            --branch: Which branch to use when downloading from github (defaults to master)
            --frontend: Which frontend to use
            --backend: Which backend to use
            --fullstack: If the selected stack is a fullstack framework
            --manager: Which package manager to use
            --autostart: Whether the CLI should start the project after setting up
        */
        const userArgumentsRaw = await yargs(hideBin(process.argv)).argv;
        validateUserArguments(userArgumentsRaw);
        const userArguments = {
            ...userArgumentsRaw,
            manager: userArgumentsRaw.manager ?? inferredPackageManager() ?? "npm",
        };
        if (userArguments.dashboardDemo === "true") {
            userArguments.appname = "dashboard-demo";
            userArguments.frontend = "next-app-directory";
            userArguments.recipe = "dashboardDemo";
        }
        AnalyticsManager.sendAnalyticsEvent({
            eventName: "cli_started",
        });
        // Inquirer prompts all the questions to the user, answers will be an object that contains all the responses
        answers = await inquirer.prompt(await getQuestions(userArguments));
        answers = modifyAnswersBasedOnFlags(answers, userArguments);
        answers = modifyAnswersForPythonFrameworks(answers);
        answers = modifyAnswersBasedOnNextJsFramework(answers);
        answers = modifyAnswersBasedOnSelection(answers);
        AnalyticsManager.sendAnalyticsEvent({
            eventName: "cli_selection_complete",
            frontend: answers.frontend,
            backend: answers.backend,
        });
        if (answers.recipe === "multitenancy" || answers.recipe === "multifactorauth") {
            let recipePlaceholder = answers.recipe === "multitenancy" ? "Multitenancy" : "Multi-factor Auth";
            let errorPlaceholder = "";
            if (answers.recipe === "multitenancy") {
                if (answers.frontend === "angular-prebuilt") {
                    errorPlaceholder = "Angular";
                } else if (answers.frontend === "vue-prebuilt") {
                    errorPlaceholder = "Vue";
                }
            } else if (answers.recipe === "multifactorauth") {
                if (answers.backend === "go-http") {
                    errorPlaceholder = "Go";
                } else if (answers.backend && answers.backend.startsWith("python")) {
                    errorPlaceholder = "Python";
                }
            }
            if (errorPlaceholder !== "") {
                const errorMessage = `create-supertokens-app does not support ${recipePlaceholder} for ${errorPlaceholder} yet. ${
                    answers.recipe === "multitenancy"
                        ? "You can refer to our docs to set it up manually: https://supertokens.com/docs/multitenancy/introduction"
                        : `You can use our Node SDK instead as a separate Node auth server to your ${errorPlaceholder} backend.`
                }`;
                const error = new Error(errorMessage);
                error.skipGithubLink = true;
                throw error;
            }
        }
        console.log("");
        const downloadSpinner = Ora({
            spinner: "dots10",
            text: "Downloading files",
        }).start();
        const folderLocations = await getDownloadLocationFromAnswers(answers, userArguments);
        if (folderLocations === undefined) {
            downloadSpinner.stopAndPersist({
                text: chalk.redBright("Error downloading files"),
                symbol: Emoji.get(":no_entry:"),
            });
            throw new Error("Something went wrong, exiting....");
        }
        try {
            await downloadAppFromGithub(folderLocations, answers.appname);
            downloadSpinner.stopAndPersist({
                text: "Finished setting up folder structure!",
                symbol: Emoji.get(":white_check_mark:"),
            });
        } catch (e) {
            downloadSpinner.stopAndPersist({
                text: chalk.redBright("Error downloading files"),
                symbol: Emoji.get(":no_entry:"),
            });
            throw e;
        }
        console.log("");
        const setupSpinner = Ora({
            text: "Setting up the project",
            spinner: "dots10",
        }).start();
        try {
            await setupProject(folderLocations, answers.appname, answers, userArguments, setupSpinner);
            setupSpinner.stopAndPersist({
                text: "Setup complete!",
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
             * NOTE: We don't do this for runProject because if running fails, the user
             * can fix the error (install missing library for example) and then run the
             * app again themselves without having to run and wait for the CLI to finish
             */
            fs.rmSync(`${answers.appname}/`, {
                recursive: true,
                force: true,
            });
            throw e;
        }
        await runProjectOrPrintStartCommand(answers, userArguments);
        AnalyticsManager.sendAnalyticsEvent({
            eventName: "cli_completed",
            frontend: answers.frontend,
            backend: answers.backend,
        });
    } catch (e) {
        AnalyticsManager.sendAnalyticsEvent({
            eventName: "cli_failed",
            frontend: answers?.frontend ?? "",
            backend: answers?.backend ?? "",
            error: String(e) + e.stack === undefined ? "" : e.stack,
        });
        Logger.error(e.message);
        Logger.error(e.stack);
        if (e.skipGithubLink !== true) {
            Logger.error(
                "If you think this is an issue with the tool, please report this as an issue at https://github.com/supertokens/create-supertokens-app/issues"
            );
        }
    }
}
run();

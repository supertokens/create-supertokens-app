#!/usr/bin/env node
import inquirer from "inquirer";
import { getQuestions } from "./config.js";
import { Answers, DownloadLocations, UserFlags, UserFlagsRaw } from "./types.js";
import { getDownloadLocationFromAnswers, downloadApp, setupProject, runProjectOrPrintStartCommand } from "./utils.js";
import { downloadAppFromLocal, shouldUseLocalTemplates } from "../../util/localScaffolder.js";
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
import { modifyAnswersForPythonFrameworks, modifyAnswersForNodeJSFrameworks } from "./questionUtils.js";
import { inferredPackageManager } from "./packageManager.js";
import { checkMfaCompatibility } from "./utils.js";
import compareVersions from "tiny-version-compare";

async function checkVersion() {
    const remoteVersionReq = await fetch(
        "https://raw.githubusercontent.com/supertokens/create-supertokens-app/main/package.json"
    );
    const remoteVersion = (await remoteVersionReq.json()).version;
    const localVersion = package_version;

    const comparison = compareVersions(localVersion, remoteVersion);

    switch (comparison) {
        case -1: {
            Logger.warn(
                `A new version of the SuperTokens CLI is available: ${remoteVersion}. Your local version is ${localVersion}.`
            );
            Logger.warn(`You can use the latest CLI version by running "npx create-supertokens-app@latest".`);
            break;
        }
        case 1: {
            Logger.warn("You are using an unpublished version of the SuperTokens CLI.");
            break;
        }
        case 0:
        default: {
            return;
        }
    }
}

async function printInformation(): Promise<void> {
    const font: figlet.Fonts = "Doom";

    await checkVersion();

    console.log("\n");
    await new Promise<void>((resolve) => {
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

async function downloadAppFromGithub(folderLocations: DownloadLocations, appname: string) {
    try {
        // Use local scaffolder if USE_LOCAL_TEMPLATES is true
        if (shouldUseLocalTemplates()) {
            await downloadAppFromLocal(folderLocations, appname);
            return;
        }

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
    let answers: Answers | undefined = undefined;

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
        const userArgumentsRaw = (await yargs(hideBin(process.argv))
            .option("providers", {
                type: "array",
                string: true,
                description: "Specify third-party providers (e.g., --providers google github)",
            })
            .option("skip-install", {
                type: "boolean",
                description: "Skip the package installation step",
            })
            .array("firstfactors")
            .array("secondfactors")
            .coerce("firstfactors", (val) => {
                console.log("Raw firstfactors:", val);
                if (Array.isArray(val)) {
                    // If it's an array with a single string containing commas, split it
                    if (val.length === 1 && typeof val[0] === "string" && val[0].includes(",")) {
                        return val[0].split(",").map((f: string) => f.trim());
                    }
                    return val;
                }
                // If it's a string, split it
                return val.split(",").map((f: string) => f.trim());
            })
            .coerce("secondfactors", (val) => {
                console.log("Raw secondfactors:", val);
                if (Array.isArray(val)) {
                    // If it's an array with a single string containing commas, split it
                    if (val.length === 1 && typeof val[0] === "string" && val[0].includes(",")) {
                        return val[0].split(",").map((f: string) => f.trim());
                    }
                    return val;
                }
                // If it's a string, split it
                return val.split(",").map((f: string) => f.trim());
            }).argv) as UserFlagsRaw;
        validateUserArguments(userArgumentsRaw); // Remove await here
        const userArguments: UserFlags = {
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

        answers = await inquirer.prompt(await getQuestions(userArguments));

        answers = modifyAnswersBasedOnFlags(answers, userArguments);
        answers = modifyAnswersForPythonFrameworks(answers);
        answers = modifyAnswersForNodeJSFrameworks(answers);
        answers = modifyAnswersBasedOnSelection(answers);

        AnalyticsManager.sendAnalyticsEvent({
            eventName: "cli_selection_complete",
            frontend: answers.frontend,
            backend: answers.backend,
        });

        // Default factors for interactive MFA selection if flags weren't used
        if (
            answers.recipe === "multifactorauth" &&
            userArguments.firstfactors === undefined &&
            userArguments.secondfactors === undefined
        ) {
            userArguments.firstfactors = ["emailpassword", "thirdparty"];
            userArguments.secondfactors = ["otp-email", "totp"];
            answers.recipe = "multifactorauth";
        }

        if (answers.recipe === "multitenancy" || answers.recipe === "multifactorauth") {
            let recipePlaceholder = answers.recipe === "multitenancy" ? "Multitenancy" : "Multi-factor Auth";
            let errorPlaceholder = "";
            if (answers.recipe === "multifactorauth") {
                if (answers.backend === "go-http") {
                    errorPlaceholder = "Go";
                }
            }

            if (errorPlaceholder !== "") {
                const errorMessage = `create-supertokens-app does not support ${recipePlaceholder} for ${errorPlaceholder} yet. ${
                    answers.recipe === "multitenancy"
                        ? "You can refer to our docs to set it up manually: https://supertokens.com/docs/multitenancy/introduction"
                        : `You can use our Node SDK instead as a separate Node auth server to your ${errorPlaceholder} backend.`
                }`;
                const error = new Error(errorMessage);
                (error as any).skipGithubLink = true;
                throw error;
            }
        }

        console.log("");
        const downloadSpinner = Ora({
            spinner: "dots10",
            text: "Downloading files",
        }).start();

        checkMfaCompatibility(answers, userArguments);

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
            error: String(e) + (e as any).stack === undefined ? "" : (e as any).stack,
        });
        Logger.error((e as any).stack);

        if ((e as any).skipGithubLink !== true) {
            Logger.error(
                "If you think this is an issue with the tool, please report this as an issue at https://github.com/supertokens/create-supertokens-app/issues"
            );
        }
        process.exit(1);
    }
}

run();

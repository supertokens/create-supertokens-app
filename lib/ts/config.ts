/**
 * Exports for all options for different sections, all option exports should follow the following type:
 * 
 * {
 *      value: string,
 *      displayName: string,
 *      location: {
 *          main: string,
 *          config: string,
 *      },
 * }
 * 
 * value: The option value, this is used to retrieve the selection from inquirer's return
 * displayName: The text that is displayed to users when prompting
 * location: Path strings for where to download/locate specific parts from
 *  - main: The path for the folder from where to download the boilerplate
 *  - config: The path where all the recipe configs are (This should be a folder because the recipe name will pre post fixed when loading the config)
 * 
 * For recipes the location object is not used, the value is used to determine the path
 */

import { Answers, QuestionOption, UserFlags } from "./types.js";
import { validateFolderName } from "./utils.js";

export const nextFullStackLocation = {
    main: "fullstack/next",
    config: "fullstack/next/config"
}

export const frontendOptions: QuestionOption[] = [
    {
        value: "react",
        displayName: "React",
        location: {
            main: "frontend/react",
            config: "frontend/react/config"
        },
        script: {
            setup: "npm install"
        },
    },
    {
        value: "next",
        displayName: "Next.js",
        location: {
            main: "frontend/next-frontend",
            config: "frontend/next-frontend/config"
        },
        script: {
            setup: "npm install"
        },
    },
    {
        value: "angular",
        displayName: "Angular",
        location: {
            main: "frontend/angular",
            config: "frontend/angular/config"
        },
        script: {
            setup: "npm install"
        },
    },
    {
        value: "vue",
        displayName: "Vue.js",
        location: {
            main: "frontend/vue",
            config: "frontend/vue/config"
        },
        script: {
            setup: "npm install"
        },
    },
];

export const backendOptions: QuestionOption[] = [
    {
        value: "node",
        displayName: "Node.js",
        location: {
            main: "backend/node",
            config: "backend/node/config"
        },
        script: {
            setup: "npm install"
        },
    },
    {
        value: "nest",
        displayName: "Nest.js",
        location: {
            main: "backend/nest",
            config: "backend/nest/config"
        },
        script: {
            setup: "npm install"
        },
    },
    {
        value: "python",
        displayName: "Python",
        location: {
            main: "backend/python",
            config: "backend/python/config"
        },
    },
    {
        value: "go",
        displayName: "Golang",
        location: {
            main: "backend/golang",
            config: "backend/golang/config"
        },
    },
];

export const recipeOptions: QuestionOption[] = [
    {
        value: "emailpassword",
        displayName: "Email Password",
    },
    {
        value: "thirdpartyemailpassword",
        displayName: "Social Login + Email Password",
    },
    {
        value: "passwordless",
        displayName: "Passwordless",
    },
    {
        value: "thirdpartypasswordless",
        displayName: "Social Login + Passwordless",
    },
];

/**
 * Export for all the questions to ask the user, should follow the exact format mentioned here https://github.com/SBoudrias/Inquirer.js#objects because this config is passed to inquirer. The order of questions depends on the position of the object in the array
 */

export function getQuestions(flags: UserFlags) {
    return [
        {
            name: "appname",
            type: "input",
            message: "What is your app called?",
            default: "supertokens",
            when: flags.name === undefined,
            validate: function (input: any) {
                const validations = validateFolderName(input);
    
                if (validations.valid) {
                    return true;
                }
    
                return "Invalid project name: " + validations.problems![0];
            },
        },
        {
            name: "frontend",
            type: "list",
            message: "Choose a frontend framework (Visit our documentation for integration with other frameworks):",
            choices: mapOptionsToChoices(frontendOptions),
        },
        {
            name: "nextfullstack",
            type: "confirm",
            message: "Are you using Next.js functions for your APIs?",
            // This checks whether or not a question should be asked
            when: (answers: Answers) => {
                if (answers.frontend === "next") {
                    return true;
                }
    
                return false;
            },
        },
        {
            name: "backend",
            type: "list",
            message: "Choose a backend framework (Visit our documentation for integration with other frameworks):",
            choices: mapOptionsToChoices(backendOptions),
            when: (answers: Answers) => {
                // We skip this question if they are using Next.js fullstack
                if (answers.nextfullstack === true) {
                    return false;
                }
    
                return true;
            },
        },
        {
            name: "recipe",
            type: "list",
            message: "What type of authentication do you want to use?",
            choices: mapOptionsToChoices(recipeOptions),
            when: flags.recipe === undefined,
        },
        {
            name: "confirmation",
            type: "confirm",
            message: "Proceed with current selection?"
        }
    ];
}

/* Util Functions specific to configs */

// Converts the options array we declare to a format iquirer can use
function mapOptionsToChoices(options: QuestionOption[]) {
    return options.map(option => {
        return {
            name: option.displayName,
            value: option.value,
        };
    });
}
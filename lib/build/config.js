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
import { validateFolderName } from "./utils.js";
export const nextFullStackLocation = {
    main: "fullstack/next",
    config: "fullstack/next/config"
};
export const frontendOptions = [
    {
        value: "react",
        displayName: "React",
        location: {
            main: "frontend/supertokens-react",
            finalConfig: "/src/config.tsx",
            configFiles: "/config",
        },
        script: {
            setup: ["npm install"],
            run: ["npm run start"],
        },
    },
    {
        value: "next",
        displayName: "Next.js",
        location: {
            main: "frontend/next-frontend",
            finalConfig: "/src/config.tsx",
            configFiles: "/config",
        },
        script: {
            setup: ["npm install"],
            run: [],
        },
    },
    {
        value: "angular",
        displayName: "Angular",
        location: {
            main: "frontend/angular",
            finalConfig: "/src/config.tsx",
            configFiles: "/config",
        },
        script: {
            setup: ["npm install"],
            run: [],
        },
    },
    {
        value: "vue",
        displayName: "Vue.js",
        location: {
            main: "frontend/vue",
            finalConfig: "/src/config.tsx",
            configFiles: "/config",
        },
        script: {
            setup: ["npm install"],
            run: [],
        },
    },
];
export const backendOptions = [
    {
        value: "node",
        displayName: "Node.js",
        location: {
            main: "backend/node",
            finalConfig: "/config.ts",
            configFiles: "/config",
        },
        script: {
            setup: ["npm install"],
            run: ["echo 'Running backend app'"],
        },
    },
    {
        value: "nest",
        displayName: "Nest.js",
        location: {
            main: "backend/nest",
            finalConfig: "/config.ts",
            configFiles: "/config",
        },
        script: {
            setup: ["npm install"],
            run: [],
        },
    },
    {
        value: "python",
        displayName: "Python",
        location: {
            main: "backend/python",
            finalConfig: "/config.py",
            configFiles: "/config",
        },
    },
    {
        value: "go",
        displayName: "Golang",
        location: {
            main: "backend/golang",
            finalConfig: "/config.go",
            configFiles: "/config",
        },
    },
];
export const recipeOptions = [
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
export function getQuestions(flags) {
    return [
        {
            name: "appname",
            type: "input",
            message: "What is your app called?",
            default: "supertokens",
            when: flags.appname === undefined,
            validate: function (input) {
                const validations = validateFolderName(input);
                if (validations.valid) {
                    return true;
                }
                return "Invalid project name: " + validations.problems[0];
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
            when: (answers) => {
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
            when: (answers) => {
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
function mapOptionsToChoices(options) {
    return options.map(option => {
        return {
            name: option.displayName,
            value: option.value,
        };
    });
}

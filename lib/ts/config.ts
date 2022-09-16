import { Answers, QuestionOption, RecipeQuestionOption, UserFlags } from "./types.js";
import { validateFolderName } from "./utils.js";
import { getIsFullStackFromArgs } from "./userArgumentUtils.js";
import { getPythonRunScripts, mapOptionsToChoices } from "./questionOptionUtils.js";
import path from "path";
import fs from "fs";

export const frontendOptions: QuestionOption[] = [
    {
        value: "react",
        displayName: "React",
        location: {
            main: "frontend/supertokens-react",
            finalConfig: "/src/config.tsx",
            configFiles: "/config",
        },
        script: {
            setup: [
                "npm install",
            ],
            run: [
                "npm run start",
            ],
        },
    },
    {
        value: "next",
        displayName: "Next.js",
        location: {
            main: "frontend/next",
            finalConfig: "/config/frontendConfig.tsx",
            configFiles: "/config/frontend",
        },
        script: {
            setup: [
                "yarn install",
            ],
            run: ["npm run dev"],
        },
    },
    {
        isFullStack: true,
        shouldDisplay: false,
        value: "next-fullstack",
        displayName: "unused",
        location: {
            main: "fullstack/next",
            config: {
                frontend: {
                    configFiles: "/config/frontend",
                    finalConfig: "/config/frontendConfig.tsx",
                },
                backend: {
                    configFiles: "/config/backend",
                    finalConfig: "/config/backendConfig.ts"
                },
            },
        },
        script: {
            run: [
                "npm run dev",
            ],
            setup: [
                "yarn install",
            ],
        },
    },
    {
        value: "angular-prebuilt",
        displayName: "Angular",
        location: {
            main: "frontend/angular-prebuilt",
            finalConfig: "/src/config.ts",
            configFiles: "/config",
        },
        script: {
            setup: [
                "npm install",
            ],
            run: ["npm run dev"],
        },
    },
    {
        value: "vue-prebuilt",
        displayName: "Vue.js",
        location: {
            main: "frontend/vue-prebuilt",
            finalConfig: "/src/config.ts",
            configFiles: "/config",
        },
        script: {
            setup: [
                "npm install",
            ],
            run: ["npm run dev"],
        },
    },
];

export const backendOptions: QuestionOption[] = [
    {
        value: "node",
        displayName: "Node.js",
        location: {
            main: "backend/node-express",
            finalConfig: "/config.ts",
            configFiles: "/config",
        },
        script: {
            setup: [
                "npm install",
            ],
            run: [
                "npm run start",
            ],
        },
    },
    {
        value: "nest",
        displayName: "Nest.js",
        location: {
            main: "backend/nest",
            finalConfig: "/src/config.ts",
            configFiles: "/config",
        },
        script: {
            setup: [
                "npm install",
            ],
            run: ["npm run start"],
        },
    },
    {
        value: "python-flask",
        displayName: "Python",
        location: {
            main: "backend/python-flask",
            finalConfig: "/config.py",
            configFiles: "/config",
        },
        script: {
            setup: [],
            run: getPythonRunScripts(),
        },
    },
    {
        value: "go-http",
        displayName: "Golang",
        location: {
            main: "backend/go-http",
            finalConfig: "/config.go",
            configFiles: "/config",
        },
        script: {
            setup: ["go get && go mod tidy"],
            run: ["go run ."],
        },
    },
];

export const recipeOptions: RecipeQuestionOption[] = [
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
            default: "my-app",
            when: flags.appname === undefined,
            validate: function (input: any) {
                const validations = validateFolderName(input);
    
                if (validations.valid) {
                    const __dirname = path.resolve();
                    const projectDirectory = __dirname + `/${input}`;

                    if (fs.existsSync(projectDirectory)) {
                        throw new Error(`A folder with name "${input}" already exists`);
                    }

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
            when: flags.frontend === undefined,
        },
        {
            name: "nextfullstack",
            type: "confirm",
            message: "Are you using Next.js functions for your APIs?",
            // This checks whether or not a question should be asked
            when: (answers: Answers) => {
                // We dont use getIsFullStackFromArgs here intentionally
                if (flags.fullstack !== undefined) {
                    return false;
                }

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
                if (flags.backend !== undefined) {
                    return false;
                }

                const isFullStackFromArgs: boolean = getIsFullStackFromArgs(flags);

                if (flags.frontend === "next" && isFullStackFromArgs) {
                    // This means that they want to use nextjs fullstack
                    return false
                }

                if (answers.frontend === "next" && isFullStackFromArgs) {
                    // This means that they want to use nextjs fullstack
                    return false
                }

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
            message: "Proceed with current selection?",
            when: flags.autoconfirm === undefined,
        }
    ];
}
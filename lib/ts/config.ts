import { Answers, QuestionOption, RecipeQuestionOption, UserFlags } from "./types.js";
import { getPackageManagerCommand, validateFolderName } from "./userArgumentUtils.js";
import { getDjangoPythonRunScripts, getPythonRunScripts, mapOptionsToChoices } from "./questionUtils.js";
import path from "path";
import fs from "fs";

export async function getFrontendOptions(userArguments: UserFlags): Promise<QuestionOption[]> {
    const packagerCommand = await getPackageManagerCommand(userArguments);

    return [
        {
            value: "react",
            displayName: "React",
            location: {
                main: "frontend/supertokens-react",
                finalConfig: "/src/config.tsx",
                configFiles: "/config",
            },
            script: {
                setup: [`${packagerCommand} install`],
                run: [`${packagerCommand} run start`],
            },
        },
        {
            isFullStack: true,
            value: "next",
            displayName: "Next.js",
            location: {
                main: "fullstack/next",
                config: {
                    frontend: {
                        configFiles: "/config/frontend",
                        finalConfig: "/config/frontendConfig.tsx",
                    },
                    backend: {
                        configFiles: "/config/backend",
                        finalConfig: "/config/backendConfig.ts",
                    },
                },
            },
            script: {
                run: [`${packagerCommand} run dev`],
                setup: [`${packagerCommand} install`],
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
                setup: [`${packagerCommand} install`],
                run: [`${packagerCommand} run dev`],
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
                setup: [`${packagerCommand} install`],
                run: [`${packagerCommand} run dev`],
            },
        },
    ];
}

export async function getBackendOptions(userArguments: UserFlags): Promise<QuestionOption[]> {
    const packagerCommand = await getPackageManagerCommand(userArguments);

    return [
        {
            value: "node",
            displayName: "Node.js",
            location: {
                main: "backend/node-express",
                finalConfig: "/config.ts",
                configFiles: "/config",
            },
            script: {
                setup: [`${packagerCommand} install`],
                run: [`${packagerCommand} run start`],
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
                setup: [`${packagerCommand} install`],
                run: [`${packagerCommand} run start`],
            },
        },
        {
            value: "python-flask",
            displayName: "Python (Flask)",
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
            value: "python-django",
            displayName: "Python (Django)",
            location: {
                main: "backend/python-drf",
                finalConfig: "./app/config.py",
                configFiles: "./app/config",
            },
            script: {
                setup: [],
                run: getDjangoPythonRunScripts(),
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
                setup: ["go get ./... && go mod tidy"],
                run: ["go run ."],
            },
        },
    ];
}

export const recipeOptions: RecipeQuestionOption[] = [
    {
        value: "emailpassword",
        displayName: "Email Password",
    },
    {
        value: "thirdparty",
        displayName: "Social Login",
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

export async function getQuestions(flags: UserFlags) {
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
            choices: mapOptionsToChoices(await getFrontendOptions(flags)),
            when: flags.frontend === undefined,
        },
        {
            name: "backend",
            type: "list",
            message: "Choose a backend framework (Visit our documentation for integration with other frameworks):",
            choices: mapOptionsToChoices(await getBackendOptions(flags)),
            when: (answers: Answers) => {
                if (flags.backend !== undefined) {
                    return false;
                }

                if (flags.frontend === "next" || answers.frontend === "next") {
                    // This means that they want to use nextjs fullstack
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
    ];
}

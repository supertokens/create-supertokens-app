import { Answers, QuestionOption, RecipeQuestionOption, UserFlags } from "./types.js";
import { getPackageManagerCommand, validateFolderName } from "./userArgumentUtils.js";
import {
    getDjangoPythonRunScripts,
    getPythonRunScripts,
    mapOptionsToChoices,
    shouldSkipBackendQuestion,
} from "./questionUtils.js";
import path from "path";
import fs from "fs";
import chalk from "chalk";

function getCapacitorMessage() {
    // prettier-ignore
    {
        return `create-supertokens-app uses ${chalk.bold("capacitor-supertokens-nextjs-turborepo")} as a template app for Capacitor. ${chalk.bold("capacitor-supertokens-nextjs-turborepo")} is a starter project created by ${chalk.blue("https://github.com/RobSchilderr")}, if you face any problems please open an issue here: ${chalk.blue("https://github.com/RobSchilderr/capacitor-supertokens-nextjs-turborepo/issues")} or reach out to us on the SuperTokens Discord server: ${chalk.blue("https://supertokens.com/discord")}.\n\nTo get started refer to the README on Github ${chalk.blue("https://github.com/RobSchilderr/capacitor-supertokens-nextjs-turborepo")}`;
    }
}

export async function getFrontendOptions(userArguments: UserFlags): Promise<QuestionOption[]> {
    const packagerCommand = await getPackageManagerCommand(userArguments);

    return [
        {
            value: "react",
            displayName: "React",
            location: {
                main: "frontend/supertokens-react",
                config: [{ finalConfig: "/src/config.tsx", configFiles: "/config" }],
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
                    frontend: [
                        {
                            configFiles: "/config/frontend",
                            finalConfig: "/config/frontendConfig.tsx",
                        },
                    ],
                    backend: [
                        {
                            configFiles: "/config/backend",
                            finalConfig: "/config/backendConfig.ts",
                        },
                    ],
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
                config: [
                    { finalConfig: "/src/config.ts", configFiles: "/config" },
                    { finalConfig: "/src/configUI.ts", configFiles: "/configUI" },
                ],
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
                config: [
                    { finalConfig: "/src/config.ts", configFiles: "/config" },
                    { finalConfig: "/src/configUI.ts", configFiles: "/configUI" },
                ],
            },
            script: {
                setup: [`${packagerCommand} install`],
                run: [`${packagerCommand} run dev`],
            },
        },
        {
            value: "capacitor",
            isFullStack: true,
            displayName: "Capacitor",
            externalAppInfo: {
                isExternal: true,
                message: getCapacitorMessage(),
            },
            location: {
                main: "https://github.com/RobSchilderr/capacitor-supertokens-nextjs-turborepo/archive/master.tar.gz",
                config: {
                    frontend: [
                        {
                            configFiles: "",
                            finalConfig: "",
                        },
                    ],
                    backend: [
                        {
                            configFiles: "",
                            finalConfig: "",
                        },
                    ],
                },
            },
            // For capacitor we have no setup, we simple download the template and then link to the template
            script: {
                setup: [],
                run: [],
            },
        },
    ];
}

const pythonOptions: QuestionOption[] = [
    {
        value: "python-flask",
        displayName: "Flask",
        location: {
            main: "backend/python-flask",
            config: [{ finalConfig: "/config.py", configFiles: "/config" }],
        },
        script: {
            setup: [],
            run: getPythonRunScripts(),
        },
    },
    {
        value: "python-fastapi",
        displayName: "FastAPI",
        location: {
            main: "backend/python-fastapi",
            config: [{ finalConfig: "/config.py", configFiles: "/config" }],
        },
        script: {
            setup: [],
            run: getPythonRunScripts(),
        },
    },
    {
        value: "python-drf",
        displayName: "Django Rest Framework",
        location: {
            main: "backend/python-drf",
            config: [
                {
                    finalConfig: "./app/config.py",
                    configFiles: "./app/config",
                },
            ],
        },
        script: {
            setup: [],
            run: getDjangoPythonRunScripts(),
        },
    },
];

export async function getBackendOptions(userArguments: UserFlags): Promise<QuestionOption[]> {
    const packagerCommand = await getPackageManagerCommand(userArguments);

    return [
        {
            value: "node",
            displayName: "Node.js",
            location: {
                main: "backend/node-express",
                config: [
                    {
                        finalConfig: "/config.ts",
                        configFiles: "/config",
                    },
                ],
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
                config: [{ finalConfig: "/src/config.ts", configFiles: "/config" }],
            },
            script: {
                setup: [`${packagerCommand} install`],
                run: [`${packagerCommand} run start`],
            },
        },
        {
            value: "python",
            displayName: "Python",
            location: {
                main: "",
                config: [{ finalConfig: "", configFiles: "" }],
            },
            script: {
                setup: [],
                run: [],
            },
        },
        {
            value: "go-http",
            displayName: "Golang",
            location: {
                main: "backend/go-http",
                config: [{ finalConfig: "/config.go", configFiles: "/config" }],
            },
            script: {
                setup: ["go mod init go-http", "go get ./...", "go mod tidy"],
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
                // If shouldSkipBackendQuestion returns true we want to return false from here
                return !shouldSkipBackendQuestion(answers, flags);
            },
        },
        {
            name: "backendPython",
            type: "list",
            message: "Choose a Python framework:",
            choices: mapOptionsToChoices(pythonOptions),
            when: (answers: Answers) => {
                if (flags.backend !== undefined && flags.backend !== "python") {
                    return false;
                }

                if (flags.frontend === "next" || answers.frontend === "next") {
                    // This means that they want to use nextjs fullstack
                    return false;
                }

                if (answers.backend !== "python" && flags.backend !== "python") {
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
            when: (answers: Answers) => {
                // For capactor we dont ask this question because it has its own way of swapping between recipes
                if (answers.frontend === "capacitor") {
                    return false;
                }

                return flags.recipe === undefined;
            },
        },
    ];
}

export async function getBackendOptionForProcessing(userArguments: UserFlags): Promise<QuestionOption[]> {
    const optionsWithoutPython = await getBackendOptions(userArguments);

    return [...optionsWithoutPython, ...pythonOptions];
}

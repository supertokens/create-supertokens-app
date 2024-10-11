import { UIBuildType } from "./types.js";
import { FILTER_CHOICES_STRATEGY, filterChoices } from "./filterChoicesUtils.js";
import { validateFolderName } from "./userArgumentUtils.js";
import {
    getDjangoPythonRunScripts,
    getFrontendPromptMessage,
    getPythonRunScripts,
    getRecipePromptMessage,
    mapOptionsToChoices,
    shouldSkipBackendQuestion,
} from "./questionUtils.js";
import path from "path";
import fs from "fs";
import chalk from "chalk";
function getCapacitorMessage() {
    // prettier-ignore
    {
        return `create-supertokens-app uses ${chalk.bold("nextjs-native-starter")} as a template app for Capacitor. ${chalk.bold("nextjs-native-starter")} is a starter project created by ${chalk.blue("https://github.com/RobSchilderr")}, if you face any problems please open an issue here: ${chalk.blue("https://github.com/RobSchilderr/nextjs-native-starter/issues")} or reach out to us on the SuperTokens Discord server: ${chalk.blue("https://supertokens.com/discord")}.\n\nTo get started refer to the README on Github ${chalk.blue("https://github.com/RobSchilderr/nextjs-native-starter")}`;
    }
}
export async function getFrontendOptions({ manager }) {
    return [
        {
            value: "react",
            displayName: "React",
            location: {
                main: `frontend/supertokens-react`,
                config: [{ finalConfig: "/src/config.tsx", configFiles: "/config" }],
            },
            script: {
                setup: [`${manager} install`],
                run: [`${manager} run start`],
            },
        },
        {
            value: "react-custom",
            displayName: "React",
            location: {
                main: `frontend/supertokens-react-custom`,
                config: [{ finalConfig: "/src/config.ts", configFiles: "/src/config" }],
            },
            script: {
                setup: [`${manager} install`],
                run: [`${manager} run start`],
            },
        },
        {
            value: "react-multitenancy",
            displayName: "React",
            location: {
                main: "frontend/supertokens-react-multitenancy",
                config: [{ finalConfig: "/src/config.tsx", configFiles: "/config" }],
            },
            script: {
                setup: [`${manager} install`],
                run: [`${manager} run start`],
            },
            shouldDisplay: false,
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
                run: [`${manager} run dev`],
                setup: [`${manager} install`],
            },
        },
        {
            isFullStack: true,
            value: "next-multitenancy",
            shouldDisplay: false,
            displayName: "Next.js",
            location: {
                main: "fullstack/next-multitenancy",
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
                run: [`${manager} run dev`],
                setup: [`${manager} install`],
            },
        },
        {
            isFullStack: true,
            value: "next-app-directory-multitenancy",
            shouldDisplay: false,
            displayName: "Next.js",
            location: {
                main: "fullstack/next-app-dir-multitenancy",
                config: {
                    frontend: [
                        {
                            configFiles: "/app/config/frontend",
                            finalConfig: "/app/config/frontend.tsx",
                        },
                    ],
                    backend: [
                        {
                            configFiles: "/app/config/backend",
                            finalConfig: "/app/config/backend.ts",
                        },
                    ],
                },
            },
            script: {
                run: [`${manager} run dev`],
                setup: [`${manager} install`],
            },
        },
        {
            isFullStack: true,
            value: "remix",
            displayName: "Remix",
            location: {
                main: "fullstack/remix",
                config: {
                    frontend: [
                        {
                            configFiles: "/app/config/frontend",
                            finalConfig: "/app/config/frontend.tsx",
                        },
                    ],
                    backend: [
                        {
                            configFiles: "/app/config/backend",
                            finalConfig: "/app/config/backend.tsx",
                        },
                    ],
                },
            },
            script: {
                run: [`${manager} run dev`],
                setup: [`${manager} install`],
            },
        },
        {
            isFullStack: true,
            value: "astro",
            displayName: "Astro",
            location: {
                main: "fullstack/astro",
                config: {
                    frontend: [
                        {
                            configFiles: "/src/config/frontend",
                            finalConfig: "/src/config/frontend.ts",
                        },
                    ],
                    backend: [
                        {
                            configFiles: "/src/config/backend",
                            finalConfig: "/src/config/backend.ts",
                        },
                    ],
                },
            },
            script: {
                run: [`${manager} run dev`],
                setup: [`${manager} install`],
            },
        },
        {
            isFullStack: true,
            value: "sveltekit",
            displayName: "SvelteKit",
            location: {
                main: "fullstack/sveltekit",
                config: {
                    frontend: [
                        {
                            configFiles: "/src/config/frontend",
                            finalConfig: "/src/config/frontend.ts",
                        },
                    ],
                    backend: [
                        {
                            configFiles: "/src/config/backend",
                            finalConfig: "/src/config/backend.ts",
                        },
                    ],
                },
            },
            script: {
                run: [`${manager} run dev`],
                setup: [`${manager} install`],
            },
        },
        {
            value: "angular",
            displayName: "Angular",
            location: {
                main: "frontend/angular-prebuilt",
                config: [{ finalConfig: "/src/config.ts", configFiles: "/config" }],
            },
            script: {
                setup: [`${manager} install`],
                run: [`${manager} run dev`],
            },
        },
        {
            value: "vue",
            displayName: "Vue.js",
            location: {
                main: "frontend/vue-prebuilt",
                config: [{ finalConfig: "/src/config.ts", configFiles: "/config" }],
            },
            script: {
                setup: [`${manager} install`],
                run: [`${manager} run dev`],
            },
        },
        {
            value: "solid",
            displayName: "SolidJS",
            location: {
                main: "frontend/solid-prebuilt",
                config: [{ finalConfig: "/src/config.ts", configFiles: "/config" }],
            },
            script: {
                setup: [`${manager} install`],
                run: [`${manager} run dev`],
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
                main: "https://github.com/RobSchilderr/nextjs-native-starter/archive/master.tar.gz",
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
export async function getNextJSOptions({ manager }) {
    return [
        {
            displayName: "Using the App directory",
            location: {
                main: "fullstack/next-app-dir",
                config: {
                    frontend: [
                        {
                            configFiles: "/app/config/frontend",
                            finalConfig: "/app/config/frontend.tsx",
                        },
                    ],
                    backend: [
                        {
                            configFiles: "/app/config/backend",
                            finalConfig: "/app/config/backend.ts",
                        },
                    ],
                },
            },
            script: {
                run: [`${manager} run dev`],
                setup: [`${manager} install`],
            },
            value: "next-app-directory",
            isFullStack: true,
        },
        {
            isFullStack: true,
            value: "next",
            displayName: "Using the Pages directory",
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
                run: [`${manager} run dev`],
                setup: [`${manager} install`],
            },
        },
    ];
}
const pythonOptions = [
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
export async function getBackendOptions({ manager }) {
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
                setup: [`${manager} install`],
                run: [`${manager} run start`],
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
                setup: [`${manager} install`],
                run: [`${manager} run start`],
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
export const recipeOptions = [
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
    {
        value: "all_auth",
        displayName: "Social Login + Email Password + Passwordless",
    },
    {
        value: "multitenancy",
        displayName: "Multi-tenant Authentication",
    },
    {
        value: "multifactorauth",
        displayName: "Multi-factor Authentication",
    },
];
export const uiBuildOptions = [
    {
        value: UIBuildType.PRE_BUILT,
        displayName: "Pre-built UI (Recommended)",
    },
    {
        value: UIBuildType.CUSTOM,
        displayName: "Custom UI",
    },
];
/**
 * Export for all the questions to ask the user, should follow the exact format mentioned here https://github.com/SBoudrias/Inquirer.js#objects because this config is passed to inquirer. The order of questions depends on the position of the object in the array
 */
export async function getQuestions(flags) {
    return [
        {
            name: "appname",
            type: "input",
            message: "What is your app called?",
            default: "my-app",
            when: flags.appname === undefined,
            validate: function (input) {
                const validations = validateFolderName(input);
                if (validations.valid) {
                    const __dirname = path.resolve();
                    const projectDirectory = __dirname + `/${input}`;
                    if (fs.existsSync(projectDirectory)) {
                        throw new Error(`A folder with name "${input}" already exists`);
                    }
                    return true;
                }
                return "Invalid project name: " + validations.problems[0];
            },
        },
        {
            name: "ui",
            type: "list",
            message: "Choose the ui build type for your frontend:",
            choices: mapOptionsToChoices(uiBuildOptions),
            when: flags.ui === undefined,
        },
        {
            name: "frontend",
            type: "list",
            message: (answers) => getFrontendPromptMessage(answers),
            choices: async (answers) =>
                filterChoices(
                    mapOptionsToChoices(await getFrontendOptions(flags)),
                    answers,
                    FILTER_CHOICES_STRATEGY.filterFrontendByUiType
                ),
            when: flags.frontend === undefined,
        },
        {
            name: "frontendNext",
            type: "list",
            message: "Choose how you want to organise your Next.js routes:",
            choices: mapOptionsToChoices(await getNextJSOptions(flags)),
            when: (answers) => {
                if (flags.frontend !== undefined && flags.frontend === "next") {
                    return true;
                }
                return answers.frontend === "next";
            },
        },
        {
            name: "backend",
            type: "list",
            message: "Choose a backend framework (Visit our documentation for integration with other frameworks):",
            choices: mapOptionsToChoices(await getBackendOptions(flags)),
            when: (answers) => {
                // If shouldSkipBackendQuestion returns true we want to return false from here
                return !shouldSkipBackendQuestion(answers, flags);
            },
        },
        {
            name: "backendPython",
            type: "list",
            message: "Choose a Python framework:",
            choices: mapOptionsToChoices(pythonOptions),
            when: (answers) => {
                if (flags.backend !== undefined && flags.backend !== "python") {
                    return false;
                }
                if (
                    (flags.frontend !== undefined && flags.frontend.startsWith("next")) ||
                    (answers.frontend !== undefined && answers.frontend.startsWith("next"))
                ) {
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
            message: (answers) => getRecipePromptMessage(answers),
            choices: async (answers) =>
                filterChoices(
                    mapOptionsToChoices(recipeOptions),
                    answers,
                    FILTER_CHOICES_STRATEGY.filterRecipeByUiType
                ),
            when: (answers) => {
                // For capacitor we don't ask this question because it has its own way of swapping between recipes
                if (answers.frontend === "capacitor") {
                    return false;
                }
                return flags.recipe === undefined;
            },
        },
    ];
}
export async function getFrontendOptionsForProcessing(userArguments) {
    const optionsWithoutNext = await getFrontendOptions(userArguments);
    const nextOptions = await getNextJSOptions(userArguments);
    return [...optionsWithoutNext, ...nextOptions];
}
export async function getBackendOptionForProcessing(userArguments) {
    const optionsWithoutPython = await getBackendOptions(userArguments);
    return [...optionsWithoutPython, ...pythonOptions];
}

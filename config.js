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

module.exports.nextFullStackLocation = {
    main: "next-fullstack",
    config: "next-fullstack/config"
}

module.exports.frontendOptions = [
    {
        value: "react",
        displayName: "React",
        location: {
            main: "frontend/react",
            config: "frontend/react/config"
        },
    },
    {
        value: "next",
        displayName: "Next.js",
        location: {
            main: "frontend/next-frontend",
            config: "frontend/next-frontend/config"
        },
    },
    {
        value: "angular",
        displayName: "Angular",
        location: {
            main: "frontend/angular",
            config: "frontend/angular/config"
        },
    },
    {
        value: "vue",
        displayName: "Vue.js",
        location: {
            main: "frontend/vue",
            config: "frontend/vue/config"
        },
    },
];

module.exports.backendOptions = [
    {
        value: "node",
        displayName: "Node.js",
        location: {
            main: "backend/node",
            config: "backend/node/config"
        },
    },
    {
        value: "next",
        displayName: "Next.js",
        location: this.nextFullStackLocation, // TODO: Should this option only be shown if frontend was NextJS?
    },
    {
        value: "nest",
        displayName: "Nest.js",
        location: {
            main: "backend/nest",
            config: "backend/nest/config"
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

module.exports.recipeOptions = [
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

module.exports.questions = [
    {
        name: "frontend",
        type: "list",
        message: "Choose a frontend framework (Visit our documentation for integration with other frameworks):",
        choices: mapOptionsToChoices(this.frontendOptions),
    },
    {
        name: "backend",
        type: "list",
        message: "Choose a backend framework (Visit our documentation for integration with other frameworks):",
        choices: mapOptionsToChoices(this.backendOptions),
    },
    {
        name: "recipe",
        type: "list",
        message: "What type of authentication do you want to use?",
        choices: mapOptionsToChoices(this.recipeOptions),
    },
    {
        name: "confirmation",
        type: "confirm",
        message: "Proceed with current selection?"
    }
];

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
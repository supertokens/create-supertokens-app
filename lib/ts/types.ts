export type Recipe = | 
    "emailpassword" | 
    "thirdpartyemailpassword" | 
    "passwordless" | 
    "thirdpartypasswordless";

export const allRecipes: Recipe[] = [
    "emailpassword",
    "thirdpartyemailpassword",
    "passwordless",
    "thirdpartypasswordless",
];

export function isValidRecipeName(recipe: string): recipe is Recipe {
    if (allRecipes.includes(recipe as Recipe)) {
        return true;
    }

    return false;
}

export type SupportedFrontends = "react" | "next" | "next-fullstack" | "angular-prebuilt" | "vue-prebuilt";
export type SupportedBackends = "node" | "nest" | "python-flask" | "go-http";

/**
 * value: The option value, this is used to retrieve the selection from inquirer's return
 * 
 * shouldDisplay: Whether or not the question should be displayed as a prompt to the user
 * 
 * displayName: The text that is displayed to users when prompting
 * 
 * isFullStack: Whether or not the selected option is full stack
 * 
 * scripts: Commands to run during setup or when starting the app
 * 
 * location: Path strings for where to download/locate specific parts from
 *  - main: The path for the folder from where to download the boilerplate
 *  - finalConfig: The path of the config file used by the project, this should include the file extension as well
 *  - configFiles: The path where all the recipe configs are (This should be a folder because the recipe name will pre post fixed when loading the config)
 * 
 * NOTE: For fullstack options the structure of this object is different
 * 
 */
export type QuestionOption = {
    shouldDisplay?: boolean,
    value: SupportedFrontends | SupportedBackends,
    displayName: string,
    script: {
        setup: string[],
        run: string[],
    },
} & ({
    isFullStack?: false,
    location: {
        main: string,
        finalConfig: string,
        configFiles: string,
    },
} | {
    isFullStack: true,
    location: {
        main: string,
        config: {
            frontend: {
                configFiles: string,
                finalConfig: string,
            },
            backend: {
                configFiles: string,
                finalConfig: string,
            },
        },
    },
})

export type RecipeQuestionOption = {
    value: string,
    displayName: string,
    shouldDisplay?: boolean,
}

export type Answers = {
    frontend: SupportedFrontends,
    backend: SupportedBackends,
    recipe: string,
    confirmation: boolean,
    nextfullstack?: boolean,
    appname: string,
}

/**
 * download: Location of the repository that contains the frontend and backend projects for the given combination
 * frontend: Path of the frontend project relative to the download location
 * backend: Path of the backend project relative to the download location
 */
export type DownloadLocations = {
    download: string,
    frontend: string,
    backend: string,
}

export type UserFlags = {
    appname?: string,
    recipe?: string,
    branch?: string,
}
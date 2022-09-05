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
]

export function isValidRecipeName(recipe: string): recipe is Recipe {
    if (allRecipes.includes(recipe as Recipe)) {
        return true;
    }

    return false;
}

/**
 * value: The option value, this is used to retrieve the selection from inquirer's return
 * 
 * displayName: The text that is displayed to users when prompting
 * 
 * location: Path strings for where to download/locate specific parts from
 *  - main: The path for the folder from where to download the boilerplate
 *  - config: The path where all the recipe configs are (This should be a folder because the recipe name will pre post fixed when loading the config)
 * 
 * NOTE: For recipes the location object is not used, the value is used to determine the path
 */
export type QuestionOption = {
    value: string,
    displayName: string,
    location?: {
        main: string,
        config: string
    },
    script?: {
        setup: string[],
        run: string[],
    },
}

export type Answers = {
    frontend: string,
    backend: string,
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
    name?: string,
    recipe?: string,
}
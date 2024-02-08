import { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";
import { appInfo } from "./appInfo";

export let frontendConfig = (): SuperTokensConfig => {
    return {
        appInfo,
        // recipeList contains all the modules that you want to
        // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
        recipeList: [],
    };
};

export const recipeDetails = {
    docsLink: "",
};

export const PreBuiltUIList = [];

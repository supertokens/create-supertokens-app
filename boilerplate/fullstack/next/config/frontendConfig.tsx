import { appInfo } from "./appInfo";

export let frontendConfig = () => {
    return {
        appInfo,
        // recipeList contains all the modules that you want to
        // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
        recipeList: [],
        getRedirectionURL: async (context) => {
            if (context.action === "SUCCESS" && context.newSessionCreated) {
                return "/dashboard";
            }
        },
    };
};

export const recipeDetails = {
    docsLink: "",
};

export const PreBuiltUIList = [];

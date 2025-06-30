import { appInfo } from "./appInfo";
import { type SuperTokensConfig } from "supertokens-web-js/types";

export const frontendConfig = (): SuperTokensConfig => {
    return {
        appInfo,
        recipeList: [],
    };
};
export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/thirdpartyemailpassword/introduction",
};

export const PreBuiltUIList = [];

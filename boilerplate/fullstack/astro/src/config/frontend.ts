import Session from "supertokens-auth-react/recipe/session/index.js";
import { appInfo } from "./appInfo";
import { type SuperTokensConfig } from "supertokens-auth-react/lib/build/types";

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

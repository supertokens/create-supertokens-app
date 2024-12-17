// This file is responsible for bootstrapping your Remix application on the client-side. It typically imports the necessary dependencies and initializes the client-side rendering environment. In this file, you might initialize client-side libraries, set up event listeners, or perform any other client-specific initialization tasks. It's the starting point for client-side code execution.
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

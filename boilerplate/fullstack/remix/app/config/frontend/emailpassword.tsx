import EmailPasswordReact from "supertokens-auth-react/recipe/emailpassword/index.js";
import Session from "supertokens-auth-react/recipe/session/index.js";
import { appInfo } from "./appInfo";
import { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui.js";

export const frontendConfig = (): SuperTokensConfig => {
    return {
        appInfo,
        recipeList: [EmailPasswordReact.init(), Session.init()],
        getRedirectionURL: async (context) => {
            if (context.action === "SUCCESS" && context.newSessionCreated) {
                return "/dashboard";
            }
        },
    };
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/emailpassword/introduction",
};

export const PreBuiltUIList = [EmailPasswordPreBuiltUI];

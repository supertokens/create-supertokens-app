import PasswordlessReact from "supertokens-auth-react/recipe/passwordless/index.js";
import Session from "supertokens-auth-react/recipe/session/index.js";
import { appInfo } from "./appInfo";
import { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";
import { PasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/passwordless/prebuiltui.js";

export const frontendConfig = (): SuperTokensConfig => {
    return {
        appInfo,
        recipeList: [
            PasswordlessReact.init({
                contactMethod: "EMAIL_OR_PHONE",
            }),
            Session.init(),
        ],
        getRedirectionURL: async (context) => {
            if (context.action === "SUCCESS" && context.newSessionCreated) {
                return "/dashboard";
            }
        },
    };
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/passwordless/introduction",
};

export const PreBuiltUIList = [PasswordlessPreBuiltUI];

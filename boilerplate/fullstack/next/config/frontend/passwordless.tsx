import PasswordlessReact from "supertokens-auth-react/recipe/passwordless";
import { PasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/passwordless/prebuiltui";
import SessionReact from "supertokens-auth-react/recipe/session";
import { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";
import { appInfo } from "./appInfo";
import Router from "next/router";

export let frontendConfig = (): SuperTokensConfig => {
    return {
        appInfo,
        // recipeList contains all the modules that you want to
        // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
        recipeList: [
            PasswordlessReact.init({
                contactMethod: "EMAIL_OR_PHONE",
            }),
            SessionReact.init(),
        ],
        getRedirectionURL: async (context) => {
            if (context.action === "SUCCESS") {
                return "/dashboard";
            }
            return undefined;
        },
        // this is so that the SDK uses the next router for navigation
        windowHandler: (oI) => {
            return {
                ...oI,
                location: {
                    ...oI.location,
                    setHref: (href) => {
                        Router.push(href);
                    },
                },
            };
        },
    };
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/passwordless/introduction",
};

export const PreBuiltUIList = [PasswordlessPreBuiltUI];

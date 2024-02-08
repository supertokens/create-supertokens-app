import ThirdPartyEmailPassword from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import ThirdPartyPasswordless from "supertokens-auth-react/recipe/thirdpartypasswordless";
import Multitenancy from "supertokens-auth-react/recipe/multitenancy";
import { ThirdPartyEmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/thirdpartyemailpassword/prebuiltui";
import { ThirdPartyPasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/thirdpartypasswordless/prebuiltui";
import SessionReact from "supertokens-auth-react/recipe/session";
import { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";
import { appInfo } from "./appInfo";
import Router from "next/router";

export const styleOverride = `
[data-supertokens~=tenants-link] {
    margin-top: 8px;
}
`;

export let frontendConfig = (): SuperTokensConfig => {
    return {
        appInfo,
        usesDynamicLoginMethods: true,
        // recipeList contains all the modules that you want to
        // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
        recipeList: [
            ThirdPartyEmailPassword.init({
                style: styleOverride,
            }),
            ThirdPartyPasswordless.init({
                style: styleOverride,
                contactMethod: "EMAIL",
            }),
            SessionReact.init({
                onHandleEvent: (event) => {
                    // This is done to remove the saved tenantId so that when the user next
                    // visits the login page, they see the tenant drop down.
                    if (["SIGN_OUT", "UNAUTHORISED", "SESSION_CREATED"].includes(event.action)) {
                        localStorage.removeItem("tenantId");
                    }
                },
            }),
            Multitenancy.init({
                override: {
                    functions: (oI) => {
                        return {
                            ...oI,
                            getTenantId: async () => {
                                const tenantIdInStorage = localStorage.getItem("tenantId");
                                return tenantIdInStorage === null ? undefined : tenantIdInStorage;
                            },
                        };
                    },
                },
            }),
        ],
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
    docsLink: "https://supertokens.com/docs/multitenancy/introduction",
};

export const PreBuiltUIList = [ThirdPartyEmailPasswordPreBuiltUI, ThirdPartyPasswordlessPreBuiltUI];

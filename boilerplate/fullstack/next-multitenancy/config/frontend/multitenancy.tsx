import ThirdParty from "supertokens-auth-react/recipe/thirdparty";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Passwordless from "supertokens-auth-react/recipe/passwordless";
import Multitenancy from "supertokens-auth-react/recipe/multitenancy";
import { ThirdPartyPreBuiltUI } from "supertokens-auth-react/recipe/thirdparty/prebuiltui";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import { PasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/passwordless/prebuiltui";
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
        style: styleOverride,
        // recipeList contains all the modules that you want to
        // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
        recipeList: [
            EmailPassword.init(),
            ThirdParty.init(),
            Passwordless.init({
                contactMethod: "EMAIL",
            }),
            SessionReact.init(),
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

export const PreBuiltUIList = [ThirdPartyPreBuiltUI, EmailPasswordPreBuiltUI, PasswordlessPreBuiltUI];

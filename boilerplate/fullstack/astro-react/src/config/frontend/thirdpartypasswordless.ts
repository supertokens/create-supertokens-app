import ThirdPartyReact from "supertokens-auth-react/recipe/thirdparty/index.js";
import PasswordlessReact from "supertokens-auth-react/recipe/passwordless/index.js";
import Session from "supertokens-auth-react/recipe/session/index.js";
import { appInfo } from "./appInfo";
import { ThirdPartyPreBuiltUI } from "supertokens-auth-react/recipe/thirdparty/prebuiltui.js";
import { PasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/passwordless/prebuiltui.js";

export const getApiDomain = () => {
    return appInfo.apiDomain;
};

export const getWebsiteDomain = () => {
    return appInfo.websiteDomain;
};

export const frontendConfig = () => {
    return {
        appInfo,
        recipeList: [
            ThirdPartyReact.init({
                signInAndUpFeature: {
                    providers: [
                        ThirdPartyReact.Github.init(),
                        ThirdPartyReact.Google.init(),
                        ThirdPartyReact.Apple.init(),
                    ],
                },
            }),
            PasswordlessReact.init({
                contactMethod: "EMAIL_OR_PHONE",
            }),
            Session.init(),
        ],
        getRedirectionURL: async (context) => {
            return "/dashboard";
        },
    };
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/thirdpartypasswordless/introduction",
};

export const PreBuiltUIList = [ThirdPartyPreBuiltUI, PasswordlessPreBuiltUI];

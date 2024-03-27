import ThirdPartyPasswordlessReact from "supertokens-auth-react/recipe/thirdpartypasswordless/index.js";
import Session from "supertokens-auth-react/recipe/session/index.js";
import { appInfo } from "./appInfo";
import { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";
import { ThirdPartyPasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/thirdpartypasswordless/prebuiltui.js";

export const frontendConfig = (): SuperTokensConfig => {
    return {
        appInfo,
        recipeList: [
            ThirdPartyPasswordlessReact.init({
                signInUpFeature: {
                    providers: [
                        ThirdPartyPasswordlessReact.Github.init(),
                        ThirdPartyPasswordlessReact.Google.init(),
                        ThirdPartyPasswordlessReact.Apple.init(),
                    ],
                },
                contactMethod: "EMAIL_OR_PHONE",
            }),
            Session.init(),
        ],
    };
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/thirdpartypasswordless/introduction",
};

export const PreBuiltUIList = [ThirdPartyPasswordlessPreBuiltUI];

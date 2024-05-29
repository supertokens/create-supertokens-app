import EmailPasswordReact from "supertokens-auth-react/recipe/emailpassword/index.js";
import ThirdPartyReact from "supertokens-auth-react/recipe/thirdparty/index.js";
import PasswordlessReact from "supertokens-auth-react/recipe/passwordless/index.js";
import Session from "supertokens-auth-react/recipe/session/index.js";
import { appInfo } from "./appInfo";
import { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";
import { ThirdPartyPreBuiltUI } from "supertokens-auth-react/recipe/thirdparty/prebuiltui.js";
import { PasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/passwordless/prebuiltui.js";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";

export const frontendConfig = (): SuperTokensConfig => {
    return {
        appInfo,
        recipeList: [
            EmailPasswordReact.init(),
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
    };
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/thirdpartypasswordless/introduction",
};

export const PreBuiltUIList = [EmailPasswordPreBuiltUI, ThirdPartyPreBuiltUI, PasswordlessPreBuiltUI];

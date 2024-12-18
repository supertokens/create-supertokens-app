import ThirdPartyReact from "supertokens-auth-react/recipe/thirdparty/index.js";
import EmailPasswordReact from "supertokens-auth-react/recipe/emailpassword/index.js";
import MultiFactorAuthReact from "supertokens-auth-react/recipe/multifactorauth/index.js";
import EmailVerification from "supertokens-auth-react/recipe/emailverification/index.js";
import PasswordlessReact from "supertokens-auth-react/recipe/passwordless/index.js";
import TOTPReact from "supertokens-auth-react/recipe/totp/index.js";
import Session from "supertokens-auth-react/recipe/session/index.js";
import { appInfo } from "./appInfo";
import { ThirdPartyPreBuiltUI } from "supertokens-auth-react/recipe/thirdparty/prebuiltui.js";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui.js";
import { MultiFactorAuthPreBuiltUI } from "supertokens-auth-react/recipe/multifactorauth/prebuiltui.js";
import { EmailVerificationPreBuiltUI } from "supertokens-auth-react/recipe/emailverification/prebuiltui.js";
import { TOTPPreBuiltUI } from "supertokens-auth-react/recipe/totp/prebuiltui.js";
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
            EmailPasswordReact.init(),
            ThirdPartyReact.init({
                signInAndUpFeature: {
                    providers: [
                        ThirdPartyReact.Google.init(),
                        ThirdPartyReact.Github.init(),
                        ThirdPartyReact.Apple.init(),
                    ],
                },
            }),
            PasswordlessReact.init({
                contactMethod: "EMAIL_OR_PHONE",
            }),
            EmailVerification.init({ mode: "REQUIRED" }),
            MultiFactorAuthReact.init({ firstFactors: ["thirdparty", "emailpassword"] }),
            TOTPReact.init(),
            Session.init(),
        ],
        getRedirectionURL: async (context) => {
            return "/dashboard";
        },
    };
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/mfa/introduction",
};

export const PreBuiltUIList = [
    ThirdPartyPreBuiltUI,
    EmailPasswordPreBuiltUI,
    PasswordlessPreBuiltUI,
    MultiFactorAuthPreBuiltUI,
    EmailVerificationPreBuiltUI,
    TOTPPreBuiltUI,
];

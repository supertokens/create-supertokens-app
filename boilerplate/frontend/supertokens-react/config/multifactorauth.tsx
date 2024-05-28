import ThirdParty, { Google, Github, Apple, Twitter } from "supertokens-auth-react/recipe/thirdparty";
import { ThirdPartyPreBuiltUI } from "supertokens-auth-react/recipe/thirdparty/prebuiltui";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import Passwordless from "supertokens-auth-react/recipe/passwordless";
import { PasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/passwordless/prebuiltui";
import MultiFactorAuth from "supertokens-auth-react/recipe/multifactorauth";
import { MultiFactorAuthPreBuiltUI } from "supertokens-auth-react/recipe/multifactorauth/prebuiltui";
import EmailVerification from "supertokens-auth-react/recipe/emailverification";
import { EmailVerificationPreBuiltUI } from "supertokens-auth-react/recipe/emailverification/prebuiltui";
import TOTP from "supertokens-auth-react/recipe/totp";
import { TOTPPreBuiltUI } from "supertokens-auth-react/recipe/totp/prebuiltui";
import Session from "supertokens-auth-react/recipe/session";

export function getApiDomain() {
    const apiPort = process.env.REACT_APP_API_PORT || 3001;
    const apiUrl = process.env.REACT_APP_API_URL || `http://localhost:${apiPort}`;
    return apiUrl;
}

export function getWebsiteDomain() {
    const websitePort = process.env.REACT_APP_WEBSITE_PORT || 3000;
    const websiteUrl = process.env.REACT_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
    return websiteUrl;
}

export const SuperTokensConfig = {
    appInfo: {
        appName: "SuperTokens Demo App",
        apiDomain: getApiDomain(),
        websiteDomain: getWebsiteDomain(),
    },
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
        ThirdParty.init({
            signInAndUpFeature: {
                providers: [Github.init(), Google.init(), Apple.init(), Twitter.init()],
            },
        }),
        EmailPassword.init(),
        Passwordless.init({
            contactMethod: "EMAIL_OR_PHONE",
        }),
        MultiFactorAuth.init({ firstFactors: ["thirdparty", "emailpassword"] }),
        EmailVerification.init({
            mode: "REQUIRED",
        }),
        TOTP.init(),
        Session.init(),
    ],
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

export const ComponentWrapper = (props: { children: JSX.Element }): JSX.Element => {
    return props.children;
};

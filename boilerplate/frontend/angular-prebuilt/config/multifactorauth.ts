import ThirdParty, { Google, Github, Apple, Twitter } from "supertokens-auth-react/recipe/thirdparty";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Passwordless from "supertokens-auth-react/recipe/passwordless";
import EmailVerification from "supertokens-auth-react/recipe/emailverification";
import MultiFactorAuth from "supertokens-auth-react/recipe/multifactorauth";
import TOTP from "supertokens-auth-react/recipe/totp";
import Session from "supertokens-auth-react/recipe/session";

export const SuperTokensConfig = {
    appInfo: {
        appName: "SuperTokens Demo App",
        apiDomain: "http://localhost:3001",
        websiteDomain: "http://localhost:3000",
    },
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
        EmailPassword.init(),
        ThirdParty.init({
            signInAndUpFeature: {
                providers: [Github.init(), Google.init(), Apple.init(), Twitter.init()],
            },
        }),
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

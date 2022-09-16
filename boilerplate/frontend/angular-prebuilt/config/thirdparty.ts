import * as ThirdPartyReact from "supertokens-auth-react/recipe/thirdparty";
import { Github, Google, Apple } from "supertokens-auth-react/recipe/thirdparty";
import SessionReact from "supertokens-auth-react/recipe/session";
import Session from "supertokens-web-js/recipe/session";

export const SuperTokensReactConfig = {
    appInfo: {
        appName: "SuperTokens Demo App",
        apiDomain: "http://localhost:3001",
        websiteDomain: "http://localhost:3000",
    },
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
        ThirdPartyReact.init({
            signInAndUpFeature: {
                providers: [Github.init(), Google.init(), Apple.init()],
            },
            emailVerificationFeature: {
                mode: "REQUIRED",
            },
        }),
        SessionReact.init(),
    ],
}

export const SuperTokensWebJSConfig = {
    appInfo: {
        appName: "SuperTokens Demo",
        apiDomain: "http://localhost:3001",
    },
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [Session.init()],
}
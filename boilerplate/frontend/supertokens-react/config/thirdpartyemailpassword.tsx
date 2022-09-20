import ThirdPartyEmailPassword, { Google, Github, Apple } from "supertokens-auth-react/recipe/thirdpartyemailpassword";
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
        ThirdPartyEmailPassword.init({
            signInAndUpFeature: {
                providers: [Github.init(), Google.init(), Apple.init()],
            },
        }),
        Session.init(),
    ],
};

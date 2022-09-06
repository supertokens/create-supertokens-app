import ThirdPartyEmailPassword, {
    Google,
    Github,
    Apple,
} from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import Session from "supertokens-auth-react/recipe/session";

export const recipeList = [
    ThirdPartyEmailPassword.init({
        signInAndUpFeature: {
            providers: [Github.init(), Google.init(), Apple.init()],
        },
        emailVerificationFeature: {
            mode: "REQUIRED",
        },
    }),
    Session.init(),
];

export const AuthWrapper = ThirdPartyEmailPassword.ThirdPartyEmailPasswordAuth;
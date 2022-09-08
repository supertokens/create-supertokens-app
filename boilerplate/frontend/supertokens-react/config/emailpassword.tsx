import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";

// TODO: Add dashboard recipe as well for all frontends
export const recipeList = [
    EmailPassword.init({
        emailVerificationFeature: {
            mode: "REQUIRED",
        },
    }),
    Session.init(),
];

export const AuthWrapper = EmailPassword.EmailPasswordAuth;
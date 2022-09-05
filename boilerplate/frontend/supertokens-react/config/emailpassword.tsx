import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";

export const recipeList = [
    EmailPassword.init({
        emailVerificationFeature: {
            mode: "REQUIRED",
        },
    }),
    Session.init(),
];

export const AuthWrapper = EmailPassword.EmailPasswordAuth;
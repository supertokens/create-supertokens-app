import Passwordless from "supertokens-auth-react/recipe/passwordless";
import Session from "supertokens-auth-react/recipe/session";

export const recipeList = [
    Passwordless.init({
        contactMethod: "EMAIL_OR_PHONE",
    }),
    Session.init(),
];

export const AuthWrapper = Passwordless.PasswordlessAuth;
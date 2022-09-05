import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";

export const recipeList = [
    EmailPassword.init(),
    Session.init(),
];
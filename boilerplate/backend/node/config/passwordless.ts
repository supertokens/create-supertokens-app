import Passwordless from "supertokens-node/recipe/passwordless";
import Session from "supertokens-node/recipe/session";

export const recipeList = [
    Passwordless.init({
        contactMethod: "EMAIL_OR_PHONE",
        flowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
    }),
    Session.init(),
]
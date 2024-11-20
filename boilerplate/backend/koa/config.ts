import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import Dashboard from "supertokens-node/recipe/dashboard";
import UserRoles from "supertokens-node/recipe/userroles";
import { appInfo } from "./appInfo";
import { TypeInput } from "supertokens-node/types";
import SuperTokens from "supertokens-node";

export const SuperTokensConfig: TypeInput = {
    appInfo,
    supertokens: {
        connectionURI: "https://try.supertokens.io",
    },
    recipeList: [],
};

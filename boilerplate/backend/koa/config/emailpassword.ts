import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import { TypeInput } from "supertokens-node/types";
import Dashboard from "supertokens-node/recipe/dashboard";
import UserRoles from "supertokens-node/recipe/userroles";
import { appInfo } from "./appInfo";

export const SuperTokensConfig: TypeInput = {
    framework: "koa",
    supertokens: {
        connectionURI: "https://try.supertokens.com",
    },
    appInfo,
    recipeList: [EmailPassword.init(), Session.init(), Dashboard.init(), UserRoles.init()],
};

import PasswordlessNode from "supertokens-node/recipe/passwordless/index.js";
import SessionNode from "supertokens-node/recipe/session/index.js";
import Dashboard from "supertokens-node/recipe/dashboard/index.js";
import UserRoles from "supertokens-node/recipe/userroles/index.js";
import { appInfo } from "~/config/appInfo";
import { type TypeInput } from "supertokens-node/types";
import SuperTokens from "supertokens-node";

export let backendConfig = (): TypeInput => {
    return {
        supertokens: {
            // this is the location of the SuperTokens core.
            connectionURI: "https://try.supertokens.com",
        },
        appInfo,
        // recipeList contains all the modules that you want to
        // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
        recipeList: [
            PasswordlessNode.init({
                contactMethod: "EMAIL_OR_PHONE",
                flowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
            }),
            SessionNode.init(),
            Dashboard.init(),
            UserRoles.init(),
        ],
        isInServerlessEnv: true,
        framework: "custom",
    };
};

let initialized = false;
export function ensureSuperTokensInit() {
    if (!initialized) {
        SuperTokens.init(backendConfig());
        initialized = true;
    }
}

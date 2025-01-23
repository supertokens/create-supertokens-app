import SuperTokens from "supertokens-node";
import { type TypeInput } from "supertokens-node/types";
import SessionNode from "supertokens-node/recipe/session/index.js";
import Dashboard from "supertokens-node/recipe/dashboard/index.js";
import UserRoles from "supertokens-node/recipe/userroles/index.js";
import EmailPasswordNode from "supertokens-node/recipe/emailpassword/index.js";

import { appInfo } from "~/config/appInfo";

export const backendConfig = (): TypeInput => {
    return {
        appInfo,
        supertokens: {
            connectionURI: "https://try.supertokens.io",
        },
        recipeList: [],
    };
};

let initialized = false;
export function ensureSuperTokensInit() {
    if (!initialized) {
        SuperTokens.init(backendConfig());
        initialized = true;
    }
}

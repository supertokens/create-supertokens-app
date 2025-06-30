import EmailPasswordNode from "supertokens-node/recipe/emailpassword/index.js";
import SessionNode from "supertokens-node/recipe/session/index.js";
import Dashboard from "supertokens-node/recipe/dashboard/index.js";
import UserRoles from "supertokens-node/recipe/userroles/index.js";
import { appInfo } from "./appInfo";
import { type TypeInput } from "supertokens-node/types";
import SuperTokens from "supertokens-node";
import { config } from "../../../../shared/config/base"; // Corrected import path
export const backendConfig = (): TypeInput => {
    return {
        appInfo,
        supertokens: {
            connectionURI: config.connectionURI, // Use shared config value
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

import EmailPasswordNode from "supertokens-node/recipe/emailpassword";
import SessionNode from "supertokens-node/recipe/session";
import Dashboard from "supertokens-node/recipe/dashboard";
import UserRoles from "supertokens-node/recipe/userroles";
import { appInfo } from "./appInfo";
import { type TypeInput } from "supertokens-node/types";
import SuperTokens from "supertokens-node";
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

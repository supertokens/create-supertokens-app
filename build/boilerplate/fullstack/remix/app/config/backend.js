import { appInfo } from "./appInfo";
import SuperTokens from "supertokens-node";
export const backendConfig = () => {
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

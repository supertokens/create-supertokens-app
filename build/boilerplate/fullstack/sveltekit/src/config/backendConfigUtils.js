import SuperTokens from "supertokens-node";
import { SuperTokensConfig as STConfig } from "./backend";
export let backendConfig = () => {
    return {
        supertokens: {
            // this is the location of the SuperTokens core.
            connectionURI: STConfig.supertokens.connectionURI,
        },
        appInfo: STConfig.appInfo,
        // recipeList contains all the modules that you want to
        // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
        recipeList: STConfig.recipeList,
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

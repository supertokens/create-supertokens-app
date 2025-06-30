import { TypeInput } from "supertokens-node/types";
import { appInfo } from "./appInfo";

export const SuperTokensConfig: TypeInput = {
    framework: "express",
    supertokens: {
        // this is the location of the SuperTokens core.
        connectionURI: "https://try.supertokens.com",
    },
    appInfo,
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [],
    isInServerlessEnv: true,
};

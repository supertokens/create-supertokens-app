import { TypeInput } from "supertokens-node/types";

export const SuperTokensConfig: TypeInput = {
    supertokens: {
        // this is the location of the SuperTokens core.
        connectionURI: "",
    },
    appInfo: {
        appName: "",
        apiDomain: "",
        websiteDomain: "",
    },
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [],
};

export const recipeList = [];

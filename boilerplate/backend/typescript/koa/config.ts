import { TypeInput } from "supertokens-node/types";

export function getApiDomain() {
    return "";
}

export function getWebsiteDomain() {
    return "";
}

export const SuperTokensConfig: TypeInput = {
    supertokens: {
        // this is the location of the SuperTokens core.
        connectionURI: "",
    },
    appInfo: {
        // learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo
        appName: "",
        apiDomain: "",
        websiteDomain: "",
    },
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [],
};

export const recipeList = [];

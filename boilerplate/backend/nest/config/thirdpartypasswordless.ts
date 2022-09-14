import ThirdPartyPasswordless from "supertokens-node/recipe/thirdpartypasswordless";
import Session from "supertokens-node/recipe/session";

export const appInfo = {
    // Learn more about this on https://supertokens.com/docs/thirdpartypasswordless/appinfo
    appName: "ST",
    apiDomain: "http://localhost:3001",
    websiteDomain: "http://localhost:3000",
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
}

export const connectionUri = "https://try.supertokens.com";

export const recipeList = [
    ThirdPartyPasswordless.init({
        flowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
        contactMethod: "EMAIL_OR_PHONE"
      }),
    Session.init(),
];
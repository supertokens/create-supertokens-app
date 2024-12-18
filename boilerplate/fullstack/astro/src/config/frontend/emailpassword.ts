import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";
import { appInfo } from "./appInfo";

export const getApiDomain = () => {
    return appInfo.apiDomain;
};

export const getWebsiteDomain = () => {
    return appInfo.websiteDomain;
};

export function initSuperTokensUI() {
    (window as any).supertokensUIInit("supertokensui", {
        appInfo,
        recipeList: [(window as any).supertokensUIEmailPassword.init(), (window as any).supertokensUISession.init()],
        getRedirectionURL: async (context) => {
            return "/dashboard";
        },
    });
}

export function initSuperTokensWebJS() {
    SuperTokens.init({
        appInfo,
        recipeList: [Session.init()],
    });
}

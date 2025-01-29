import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";
import { defaultAppInfo, defaultRedirectionCallback, defaultOAuthProviders } from "../config/base";

export const SuperTokensConfig = {
    appInfo: {
        appName: defaultAppInfo.appName,
        apiDomain: defaultAppInfo.apiDomain,
        websiteDomain: defaultAppInfo.websiteDomain,
        apiBasePath: defaultAppInfo.apiBasePath,
        websiteBasePath: defaultAppInfo.websiteBasePath,
    },
    recipeList: [Session.init()],
    getRedirectionURL: defaultRedirectionCallback,
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/guides",
};

export function initSuperTokensUI() {
    (window as any).supertokensUIInit("supertokensui", {
        ...SuperTokensConfig,
        recipeList: [
            (window as any).supertokensUIEmailPassword.init(),
            (window as any).supertokensUIThirdParty.init({
                signInAndUpFeature: {
                    providers: [
                        (window as any).supertokensUIThirdParty.Github.init(),
                        (window as any).supertokensUIThirdParty.Google.init(),
                        (window as any).supertokensUIThirdParty.Apple.init(),
                        (window as any).supertokensUIThirdParty.Twitter.init(),
                    ],
                },
            }),
            (window as any).supertokensUIPasswordless.init({
                contactMethod: "EMAIL_OR_PHONE",
            }),
            (window as any).supertokensUISession.init(),
        ],
    });
}

export function initSuperTokensWebJS() {
    SuperTokens.init(SuperTokensConfig);
}

import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";
import EmailVerification from "supertokens-web-js/recipe/emailverification";
import MultiFactorAuth from "supertokens-web-js/recipe/multifactorauth";

export function getApiDomain() {
    const apiPort = import.meta.env.VITE_API_PORT || 3001;
    const apiUrl = import.meta.env.VITE_API_URL || `http://localhost:${apiPort}`;
    return apiUrl;
}

export function getWebsiteDomain() {
    const websitePort = import.meta.env.VITE_WEBSITE_PORT || 3000;
    const websiteUrl = import.meta.env.VITE_WEBSITE_URL || `http://localhost:${websitePort}`;
    return websiteUrl;
}

export const SuperTokensConfig = {
    appInfo: {
        appName: "SuperTokens Demo App",
        apiDomain: getApiDomain(),
        websiteDomain: getWebsiteDomain(),
        apiBasePath: "/auth",
        websiteBasePath: "/auth",
    },
    recipeList: [Session.init(), EmailVerification.init(), MultiFactorAuth.init()],
    getRedirectionURL: async (context) => {
        if (context.action === "SUCCESS") {
            return "/dashboard";
        }
        return undefined;
    },
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/mfa/introduction",
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
            (window as any).supertokensUIPasswordless.init({ contactMethod: "EMAIL_OR_PHONE" }),
            (window as any).supertokensUISession.init(),
        ],
    });
}

export function initSuperTokensWebJS() {
    SuperTokens.init(SuperTokensConfig);
}
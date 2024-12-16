import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";
import { JSX } from "solid-js";

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
    recipeList: [Session.init()],
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/guides",
};

export const ComponentWrapper = (props: { children: JSX.Element }): JSX.Element => {
    return props.children;
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
        getRedirectionURL: async (context) => {
            if (context.action === "SUCCESS" && context.newSessionCreated) {
                return "/dashboard";
            }
        },
    });
}

export function initSuperTokensWebJS() {
    SuperTokens.init(SuperTokensConfig);
}

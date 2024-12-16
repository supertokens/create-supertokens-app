import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";
import { JSX } from "solid-js";

export function getApiDomain() {
    const apiPort = process.env.VITE_API_PORT || 3001;
    const apiUrl = process.env.VITE_API_URL || `http://localhost:${apiPort}`;
    return apiUrl;
}

export function getWebsiteDomain() {
    const websitePort = process.env.VITE_WEBSITE_PORT || 3000;
    const websiteUrl = process.env.VITE_WEBSITE_URL || `http://localhost:${websitePort}`;
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
    docsLink: "https://supertokens.com/docs/thirdparty/introduction",
};

export const ComponentWrapper = (props: { children: JSX.Element }): JSX.Element => {
    return props.children;
};

export function initSuperTokensUI() {
    (window as any).supertokensUIInit("supertokensui", {
        ...SuperTokensConfig,
        recipeList: [(window as any).supertokensUIThirdParty.init(), (window as any).supertokensUISession.init()],
    });
}

export function initSuperTokensWebJS() {
    SuperTokens.init(SuperTokensConfig);
}

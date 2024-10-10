import Session from "supertokens-web-js/recipe/session";
import Passwordless from "supertokens-web-js/recipe/passwordless";
import { SuperTokensConfig } from "supertokens-web-js/lib/build/types";

export function getApiDomain() {
    const apiPort = import.meta.env.VITE_APP_API_PORT || 3001;
    const apiUrl = import.meta.env.VITE_APP_API_URL || `http://localhost:${apiPort}`;
    return apiUrl;
}

export function getWebsiteDomain() {
    const websitePort = import.meta.env.VITE_APP_WEBSITE_PORT || 3000;
    const websiteUrl = import.meta.env.VITE_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
    return websiteUrl;
}

export const superTokensConfig: SuperTokensConfig = {
    appInfo: {
        apiBasePath: "/auth",
        appName: "SuperTokens Demo App",
        apiDomain: getApiDomain(),
    },
    recipeList: [Session.init(), Passwordless.init()],
};

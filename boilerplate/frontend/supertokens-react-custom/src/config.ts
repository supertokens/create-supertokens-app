import EmailPassword from "supertokens-web-js/recipe/emailpassword";
import Session from "supertokens-web-js/recipe/session";
import Passwordless from "supertokens-web-js/recipe/passwordless";
import ThirdParty from "supertokens-web-js/recipe/thirdparty";
import { SuperTokensConfig } from "supertokens-web-js/lib/build/types";

export function getApiDomain() {
    const apiPort = import.meta.env.VITE_APP_API_PORT || 3001;
    const apiUrl = import.meta.env.VITE_APP_API_URL || `http://localhost:${apiPort}`;
    return apiUrl;
}

export function getWebsiteDomain() {
    const websitePort = import.meta.env.VITE_APP_WEBSITE_PORT || 5173;
    const websiteUrl = import.meta.env.VITE_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
    return websiteUrl;
}

export const superTokensConfig: SuperTokensConfig = {
    appInfo: {
        apiDomain: "http://localhost:3001",
        apiBasePath: "/auth",
        appName: "Custom UI Demo",
    },
    recipeList: [Session.init(), EmailPassword.init(), Passwordless.init(), ThirdParty.init()],
};

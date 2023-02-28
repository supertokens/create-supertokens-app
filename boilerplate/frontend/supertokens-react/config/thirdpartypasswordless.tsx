import ThirdPartyPasswordless from "supertokens-auth-react/recipe/thirdpartypasswordless";
import Session from "supertokens-auth-react/recipe/session";

export function getApiDomain() {
    const apiPort = process.env.REACT_APP_API_PORT || 3001;
    const apiUrl = process.env.REACT_APP_API_URL || `http://localhost:${apiPort}`;
    return apiUrl;
}

export function getWebsiteDomain() {
    const websitePort = process.env.REACT_APP_WEBSITE_PORT || 3000;
    const websiteUrl = process.env.REACT_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
    return websiteUrl;
}

export const SuperTokensConfig = {
    appInfo: {
        appName: "SuperTokens Demo App",
        apiDomain: getApiDomain(),
        websiteDomain: getWebsiteDomain(),
    },
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
        ThirdPartyPasswordless.init({
            signInUpFeature: {
                providers: [
                    ThirdPartyPasswordless.Github.init(),
                    ThirdPartyPasswordless.Google.init(),
                    ThirdPartyPasswordless.Apple.init(),
                ],
            },
            contactMethod: "EMAIL_OR_PHONE",
        }),
        Session.init(),
    ],
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/thirdpartypasswordless/introduction",
};

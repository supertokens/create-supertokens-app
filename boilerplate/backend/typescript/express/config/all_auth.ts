import EmailPassword from "supertokens-node/recipe/emailpassword";
import ThirdParty from "supertokens-node/recipe/thirdparty";
import Passwordless from "supertokens-node/recipe/passwordless";
import Session from "supertokens-node/recipe/session";
import { TypeInput } from "supertokens-node/types";
import Dashboard from "supertokens-node/recipe/dashboard";
import UserRoles from "supertokens-node/recipe/userroles";
import { defaultAppInfo, defaultOAuthProviders, defaultSupertokensConfig } from "../../../shared/config/base";

export function getApiDomain() {
    const apiPort = process.env.VITE_APP_API_PORT || 3001;
    const apiUrl = process.env.VITE_APP_API_URL || `http://localhost:${apiPort}`;
    return apiUrl;
}

export function getWebsiteDomain() {
    const websitePort = process.env.VITE_APP_WEBSITE_PORT || 3000;
    const websiteUrl = process.env.VITE_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
    return websiteUrl;
}

export const SuperTokensConfig: TypeInput = {
    supertokens: defaultSupertokensConfig,
    appInfo: defaultAppInfo,
    recipeList: [
        EmailPassword.init(),
        ThirdParty.init({
            signInAndUpFeature: {
                providers: [
                    {
                        config: {
                            thirdPartyId: "google",
                            clients: [
                                {
                                    clientId: defaultOAuthProviders.google.clientId,
                                    clientSecret: defaultOAuthProviders.google.clientSecret,
                                },
                            ],
                        },
                    },
                    {
                        config: {
                            thirdPartyId: "github",
                            clients: [
                                {
                                    clientId: defaultOAuthProviders.github.clientId,
                                    clientSecret: defaultOAuthProviders.github.clientSecret,
                                },
                            ],
                        },
                    },
                    {
                        config: {
                            thirdPartyId: "apple",
                            clients: [
                                {
                                    clientId: defaultOAuthProviders.apple.clientId,
                                    additionalConfig: defaultOAuthProviders.apple.additionalConfig,
                                },
                            ],
                        },
                    },
                    {
                        config: {
                            thirdPartyId: "twitter",
                            clients: [
                                {
                                    clientId: defaultOAuthProviders.twitter.clientId,
                                    clientSecret: defaultOAuthProviders.twitter.clientSecret,
                                },
                            ],
                        },
                    },
                ],
            },
        }),
        Passwordless.init({
            contactMethod: "EMAIL_OR_PHONE",
            flowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
        }),
        Session.init(),
        Dashboard.init(),
        UserRoles.init(),
    ],
};

import { type OAuthProvider, type ConfigType } from "../../../../lib/ts/templateBuilder/types";
import { configToRecipes } from "../../../../lib/ts/templateBuilder/constants";
import { config } from "../config/base";
import { appInfo } from "../config/appInfo";
import { oAuthProviders } from "../config/oAuthProviders";

export const tsRecipeImports = {
    emailPassword: 'import EmailPassword from "supertokens-node/recipe/emailpassword";',
    thirdParty: 'import ThirdParty from "supertokens-node/recipe/thirdparty";',
    passwordless: 'import Passwordless from "supertokens-node/recipe/passwordless";',
    session: 'import Session from "supertokens-node/recipe/session";',
    dashboard: 'import Dashboard from "supertokens-node/recipe/dashboard";',
    userRoles: 'import UserRoles from "supertokens-node/recipe/userroles";',
    multiFactorAuth: 'import MultiFactorAuth from "supertokens-node/recipe/multifactorauth";',
    accountLinking: 'import AccountLinking from "supertokens-node/recipe/accountlinking";',
    emailVerification: 'import EmailVerification from "supertokens-node/recipe/emailverification";',
    totp: 'import TOTP from "supertokens-node/recipe/totp";',
};

export const tsBaseTemplate = `import { TypeInput } from "supertokens-node/types";

export function getApiDomain() {
    const apiPort = process.env.VITE_APP_API_PORT || 3001;
    const apiUrl = process.env.VITE_APP_API_URL || \`http://localhost:\${apiPort}\`;
    return apiUrl;
}

export function getWebsiteDomain() {
    const websitePort = process.env.VITE_APP_WEBSITE_PORT || 3000;
    const websiteUrl = process.env.VITE_APP_WEBSITE_URL || \`http://localhost:\${websitePort}\`;
    return websiteUrl;
}`;

export const tsRecipeInits = {
    emailPassword: () => `EmailPassword.init()`,
    thirdParty: (providers?: OAuthProvider[]) => `ThirdParty.init({
    signInAndUpFeature: {
        providers: [
            ${(providers || [])
                .map(
                    (p) => `{
                config: {
                    thirdPartyId: "${p.id}",
                    clients: [
                        {
                            clientId: "${p.clientId}",
                            clientSecret: "${p.clientSecret}"${
                        p.additionalConfig
                            ? `,
                            additionalConfig: ${JSON.stringify(p.additionalConfig, null, 16)}`
                            : ""
                    }
                        }
                    ]
                }
            }`
                )
                .join(",\n            ")}
        ]
    }
})`,
    passwordless: () => `Passwordless.init({
    contactMethod: "EMAIL",
    flowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
    emailDelivery: {
        service: undefined
    }
})`,
    session: () => `Session.init()`,
    dashboard: () => `Dashboard.init()`,
    userRoles: () => `UserRoles.init()`,
    multiFactorAuth: () => `MultiFactorAuth.init({ firstFactors: ["thirdparty", "emailpassword"] })`,
    accountLinking: () => `AccountLinking.init({
    shouldDoAutomaticAccountLinking: async () => ({
        shouldAutomaticallyLink: true,
        shouldRequireVerification: true
    })
})`,
    emailVerification: () => `EmailVerification.init({ mode: "REQUIRED" })`,
    totp: () => `TOTP.init()`,
};

export const generateTypeScriptTemplate = (configType: ConfigType): string => {
    let template = "";
    const recipes = configToRecipes[configType];

    // Add recipe-specific imports
    const imports = recipes
        .map((recipe) => tsRecipeImports[recipe])
        .filter(Boolean)
        .join("\n");
    template = imports + "\n" + tsBaseTemplate + "\n";

    // Add configuration
    template += `\nexport const SuperTokensConfig = {
    supertokens: {
        connectionURI: "${config.connectionURI}",
    },
    appInfo: {
        appName: "${appInfo.appName}",
        apiDomain: getApiDomain(),
        websiteDomain: getWebsiteDomain(),
        apiBasePath: "${appInfo.apiBasePath}",
        websiteBasePath: "${appInfo.websiteBasePath}"
    },
    recipeList: [
        ${recipes
            .map((recipe) => {
                if (recipe === "thirdParty") {
                    return tsRecipeInits[recipe](oAuthProviders);
                }
                return tsRecipeInits[recipe]();
            })
            .join(",\n        ")}
    ]
} as const;

// Create a mutable version that satisfies TypeInput
export const SuperTokensConfigMutable: TypeInput = {
    ...SuperTokensConfig,
    recipeList: [...SuperTokensConfig.recipeList]
};

// For frameworks that expect different casing (like NestJS)
export const connectionUri = SuperTokensConfig.supertokens.connectionURI;
export const appInfo = SuperTokensConfig.appInfo;
export const recipeList = SuperTokensConfigMutable.recipeList;`;

    return template;
};

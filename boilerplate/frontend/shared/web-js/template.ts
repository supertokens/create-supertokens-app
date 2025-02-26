import { type ConfigType } from "../../../../lib/ts/templateBuilder/types";
import { configToRecipes } from "../../../../lib/ts/templateBuilder/constants";
import { getAppInfo } from "../../../shared/config/appInfo";

// Only include recipes that have frontend components
export const frontendRecipes = [
    "emailPassword",
    "thirdParty",
    "passwordless",
    "session",
    "multiFactorAuth",
    "accountLinking",
    "emailVerification",
    "totp",
    "multitenancy",
] as const;

export const webJsRecipeImports = {
    emailPassword: `import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";`,
    thirdParty: `import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";`,
    passwordless: `import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";`,
    session: `import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";`,
    multiFactorAuth: `import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";
import EmailVerification from "supertokens-web-js/recipe/emailverification";
import MultiFactorAuth from "supertokens-web-js/recipe/multifactorauth";`,
    accountLinking: `import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";
import AccountLinking from "supertokens-web-js/recipe/accountlinking";`,
    emailVerification: `import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";
import EmailVerification from "supertokens-web-js/recipe/emailverification";`,
    totp: `import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";
import TOTP from "supertokens-web-js/recipe/totp";`,
    multitenancy: `import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";
import Multitenancy from "supertokens-web-js/recipe/multitenancy";`,
} as const;

export const webJsRecipeInits = {
    emailPassword: () => `Session.init()`,
    thirdParty: () => `Session.init()`,
    passwordless: () => `Session.init()`,
    session: () => `Session.init()`,
    multiFactorAuth: () => `Session.init(), EmailVerification.init(), MultiFactorAuth.init()`,
    accountLinking: () => `Session.init(), AccountLinking.init()`,
    emailVerification: () => `Session.init(), EmailVerification.init()`,
    totp: () => `Session.init(), TOTP.init()`,
    multitenancy: () => `Session.init(), Multitenancy.init({
    override: {
        functions: (oI) => {
            return {
                ...oI,
                getTenantId: async () => {
                    const tenantIdInStorage = localStorage.getItem("tenantId");
                    return tenantIdInStorage === null ? undefined : tenantIdInStorage;
                },
            };
        },
    },
})`,
} as const;

export const uiRecipeInits = {
    emailPassword: () => `(window as any).supertokensUIEmailPassword.init()`,
    thirdParty: () => `(window as any).supertokensUIThirdParty.init({
                signInAndUpFeature: {
                    providers: [
                        (window as any).supertokensUIThirdParty.Github.init(),
                        (window as any).supertokensUIThirdParty.Google.init(),
                        (window as any).supertokensUIThirdParty.Apple.init(),
                        (window as any).supertokensUIThirdParty.Twitter.init(),
                    ],
                },
            })`,
    passwordless: () => `(window as any).supertokensUIPasswordless.init({
                contactMethod: "EMAIL_OR_PHONE",
            })`,
    session: () => `(window as any).supertokensUISession.init()`,
    multiFactorAuth: () => ``,
    accountLinking: () => ``,
    emailVerification: () => ``,
    totp: () => ``,
    multitenancy: () => ``,
} as const;

export function getEnvPrefix(framework: string): string {
    if (framework === "angular") {
        return "NG_APP_";
    }
    return "VITE_APP_";
}

export const generateWebJSTemplate = (configType: ConfigType, framework: string, isFullStack = false): string => {
    // Filter recipes to only include those that have frontend components
    const recipes = configToRecipes[configType].filter((recipe) =>
        frontendRecipes.includes(recipe as typeof frontendRecipes[number])
    );

    const appInfo = getAppInfo(isFullStack);

    // Add recipe-specific imports
    const mainRecipe = recipes[0];
    const recipeImports = webJsRecipeImports[mainRecipe as keyof typeof webJsRecipeImports];

    // For multitenancy, we need to add the Multitenancy recipe and its import
    const isMultitenancy = configType === "multitenancy";
    const finalImports = isMultitenancy
        ? `${recipeImports}\nimport Multitenancy from "supertokens-web-js/recipe/multitenancy";`
        : recipeImports;

    // Generate recipe inits for SuperTokensConfig
    const recipeInits = webJsRecipeInits[mainRecipe as keyof typeof webJsRecipeInits]();
    const finalRecipeInits = isMultitenancy ? `[${recipeInits}, Multitenancy.init()]` : `[${recipeInits}]`;

    // Generate UI recipe inits for initSuperTokensUI function
    const uiRecipeInitsList = [];

    if (recipes.includes("emailPassword")) {
        uiRecipeInitsList.push(uiRecipeInits.emailPassword());
    }

    if (recipes.includes("thirdParty")) {
        uiRecipeInitsList.push(uiRecipeInits.thirdParty());
    }

    if (recipes.includes("passwordless")) {
        uiRecipeInitsList.push(uiRecipeInits.passwordless());
    }

    // Always add session for UI
    uiRecipeInitsList.push(uiRecipeInits.session());

    return `${finalImports}

export function getApiDomain() {
    const apiPort = import.meta.env["${getEnvPrefix(framework)}API_PORT"] || ${appInfo.defaultApiPort};
    const apiUrl = import.meta.env["${getEnvPrefix(framework)}API_URL"] || \`http://localhost:\${apiPort}\`;
    return apiUrl;
}

export function getWebsiteDomain() {
    const websitePort = import.meta.env["${getEnvPrefix(framework)}WEBSITE_PORT"] || ${appInfo.defaultWebsitePort};
    const websiteUrl = import.meta.env["${getEnvPrefix(framework)}WEBSITE_URL"] || \`http://localhost:\${websitePort}\`;
    return websiteUrl;
}

export const SuperTokensConfig = {
    appInfo: {
        appName: "${appInfo.appName}",
        apiDomain: getApiDomain(),
        websiteDomain: getWebsiteDomain(),
        apiBasePath: "${appInfo.apiBasePath}",
        websiteBasePath: "${appInfo.websiteBasePath}"
    },
    recipeList: ${finalRecipeInits},
    getRedirectionURL: async (context: any) => {
        if (context.action === "SUCCESS") {
            return "/dashboard";
        }
        return undefined;
    },
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/${configType}/introduction",
};

export function initSuperTokensUI() {
    (window as any).supertokensUIInit("supertokensui", {
        ...SuperTokensConfig,
        recipeList: [
            ${uiRecipeInitsList.join(",\n            ")}
        ],
    });
}

export function initSuperTokensWebJS() {
    SuperTokens.init(SuperTokensConfig);
}`;
};

import { configToRecipes } from "../../../../lib/ts/templateBuilder/constants";
import { appInfo } from "../../../shared/config/appInfo";
import { oAuthProviders } from "../../../backend/shared/config/oAuthProviders";
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
];
export const reactRecipeImports = {
    emailPassword: `import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";`,
    thirdParty: `import ThirdParty from "supertokens-auth-react/recipe/thirdparty";
import { ThirdPartyPreBuiltUI } from "supertokens-auth-react/recipe/thirdparty/prebuiltui";`,
    passwordless: `import Passwordless from "supertokens-auth-react/recipe/passwordless";
import { PasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/passwordless/prebuiltui";`,
    session: `import Session from "supertokens-auth-react/recipe/session";`,
    multiFactorAuth: `import MultiFactorAuth from "supertokens-auth-react/recipe/multifactorauth";`,
    accountLinking: `import AccountLinking from "supertokens-auth-react/recipe/accountlinking";`,
    emailVerification: `import EmailVerification from "supertokens-auth-react/recipe/emailverification";
import { EmailVerificationPreBuiltUI } from "supertokens-auth-react/recipe/emailverification/prebuiltui";`,
    totp: `import TOTP from "supertokens-auth-react/recipe/totp";
import { TOTPPreBuiltUI } from "supertokens-auth-react/recipe/totp/prebuiltui";`,
    multitenancy: `import Multitenancy from "supertokens-auth-react/recipe/multitenancy";`,
};
export const reactRecipeInits = {
    emailPassword: () => `EmailPassword.init()`,
    thirdParty: (providers) => `ThirdParty.init({
    signInAndUpFeature: {
        providers: [
            ${(providers || [])
                .map(
                    (p) => `{
                id: "${p.id}",
                get: (redirectURI) => {
                    return {
                        redirectURI,
                        clientId: "${p.clientId}",
                        scope: ${
                            p.id === "google"
                                ? '["https://www.googleapis.com/auth/userinfo.email"]'
                                : p.id === "github"
                                ? '["read:user", "user:email"]'
                                : p.id === "apple"
                                ? '["name", "email"]'
                                : "[]"
                        }
                    };
                },
            }`
                )
                .join(",\n            ")}
        ]
    }
})`,
    passwordless: () => `Passwordless.init({
    contactMethod: "EMAIL",
})`,
    session: () => `Session.init()`,
    multiFactorAuth: () => `MultiFactorAuth.init()`,
    accountLinking: () => `AccountLinking.init()`,
    emailVerification: () => `EmailVerification.init({
    mode: "REQUIRED",
})`,
    totp: () => `TOTP.init()`,
    multitenancy: () => `Multitenancy.init({
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
};
export const generateReactTemplate = (configType) => {
    // Filter recipes to only include those that have frontend components
    const recipes = configToRecipes[configType].filter((recipe) => frontendRecipes.includes(recipe));
    // Add recipe-specific imports
    const recipeImports = recipes
        .map((recipe) => reactRecipeImports[recipe])
        .filter(Boolean)
        .join("\n");
    // For multitenancy, we need to add the Multitenancy recipe and its import
    const isMultitenancy = configType === "multitenancy";
    const finalImports = isMultitenancy ? `${recipeImports}\n${reactRecipeImports.multitenancy}` : recipeImports;
    // Generate recipe inits, adding multitenancy if needed
    const recipeInits = recipes.map((recipe) => {
        if (recipe === "thirdParty") {
            return reactRecipeInits[recipe](oAuthProviders);
        }
        return reactRecipeInits[recipe]();
    });
    if (isMultitenancy) {
        recipeInits.push(reactRecipeInits.multitenancy());
    }
    return `${finalImports}

export function getApiDomain() {
    const apiPort = import.meta.env.VITE_APP_API_PORT || 3001;
    const apiUrl = import.meta.env.VITE_APP_API_URL || \`http://localhost:\${apiPort}\`;
    return apiUrl;
}

export function getWebsiteDomain() {
    const websitePort = import.meta.env.VITE_APP_WEBSITE_PORT || 3000;
    const websiteUrl = import.meta.env.VITE_APP_WEBSITE_URL || \`http://localhost:\${websitePort}\`;
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
    ${isMultitenancy ? "usesDynamicLoginMethods: true,\n    " : ""}recipeList: [
        ${recipeInits.join(",\n        ")}
    ],
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/${configType}/introduction",
};

// Export UI components based on enabled recipes
export const PreBuiltUIList = [
    ${recipes
        .map((recipe) => {
            if (recipe === "emailPassword") return "EmailPasswordPreBuiltUI";
            if (recipe === "thirdParty") return "ThirdPartyPreBuiltUI";
            if (recipe === "passwordless") return "PasswordlessPreBuiltUI";
            if (recipe === "emailVerification") return "EmailVerificationPreBuiltUI";
            if (recipe === "totp") return "TOTPPreBuiltUI";
            return null;
        })
        .filter(Boolean)
        .join(", ")}
];

export const ComponentWrapper = (props: { children: JSX.Element }): JSX.Element => {
    return props.children;
};`;
};

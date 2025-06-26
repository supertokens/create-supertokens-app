import { RecipeInterface } from "supertokens-web-js/recipe/emailpassword";
import { RecipeInterface as TPRecipeInterface } from "supertokens-web-js/recipe/thirdparty";
import { RecipeInterface as PLRecipeInterface } from "supertokens-web-js/recipe/passwordless";
import { RecipeInterface as TPPLRecipeInterface } from "supertokens-web-js/recipe/thirdpartypasswordless";
import { RecipeInterface as SessionRecipeInterface } from "supertokens-web-js/recipe/session";

export type BaseConfig = {
    apiPort?: number | string;
    apiUrl?: string;
    websitePort?: number | string;
    websiteUrl?: string;
    appName?: string;
};

export function getApiDomain(config?: BaseConfig) {
    const apiPort = process.env.VITE_APP_API_PORT || config?.apiPort || 3001;
    const apiUrl = process.env.VITE_APP_API_URL || config?.apiUrl || `http://localhost:${apiPort}`;
    return apiUrl;
}

export function getWebsiteDomain(config?: BaseConfig) {
    const websitePort = process.env.VITE_APP_WEBSITE_PORT || config?.websitePort || 3000;
    const websiteUrl = process.env.VITE_APP_WEBSITE_URL || config?.websiteUrl || `http://localhost:${websitePort}`;
    return websiteUrl;
}

export const defaultAppInfo = {
    appName: "SuperTokens Demo App",
    apiDomain: getApiDomain(),
    websiteDomain: getWebsiteDomain(),
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
};

export const defaultRedirectionCallback = async (context: any) => {
    if (context.action === "SUCCESS") {
        return "/dashboard";
    }
    return undefined;
};

export const defaultOAuthProviders = {
    google: {
        clientId: "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
    },
    github: {
        clientId: "467101b197249757c71f",
    },
    apple: {
        clientId: "4398792-io.supertokens.example.service",
    },
    twitter: {
        clientId: "4398792-WXpqVXRiazdRMGNJdEZIa3RVQXc6MTpjaQ",
    },
};

export type RecipeList = Array<
    RecipeInterface | TPRecipeInterface | PLRecipeInterface | TPPLRecipeInterface | SessionRecipeInterface
>;

export type SuperTokensUIConfig = {
    appInfo: typeof defaultAppInfo;
    recipeList: RecipeList;
    getRedirectionURL?: typeof defaultRedirectionCallback;
};

export type SuperTokensWebJSConfig = {
    appInfo: Omit<typeof defaultAppInfo, "websiteDomain" | "websiteBasePath">;
    recipeList: RecipeList;
};

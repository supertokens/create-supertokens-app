import EmailPasswordReact from "supertokens-auth-react/recipe/emailpassword/index.js";
import Session from "supertokens-auth-react/recipe/session/index.js";
import { appInfo } from "./appInfo";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui.js";

export const getApiDomain = () => {
    return appInfo.apiDomain;
};

export const getWebsiteDomain = () => {
    return appInfo.websiteDomain;
};

export const frontendConfig = () => {
    return {
        appInfo,
        recipeList: [EmailPasswordReact.init(), Session.init()],
        getRedirectionURL: async (context) => {
            return "/dashboard";
        },
    };
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/emailpassword/introduction",
};

export const PreBuiltUIList = [EmailPasswordPreBuiltUI];

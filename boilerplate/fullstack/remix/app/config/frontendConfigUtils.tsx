import { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";
import { SuperTokensConfig as STConfig, PreBuiltUIList as STPreBuiltUIList } from "./frontend";

export const frontendConfig = (): SuperTokensConfig => {
    return {
        ...STConfig,
    };
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/thirdpartypasswordless/introduction",
};

export const PreBuiltUIList = STPreBuiltUIList;

import { SuperTokensConfig as STConfig, PreBuiltUIList as STPreBuiltUIList } from "./frontend";

export const frontendConfig = () => {
    return {
        ...STConfig,
    };
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/thirdpartypasswordless/introduction",
};

export const PreBuiltUIList = STPreBuiltUIList;

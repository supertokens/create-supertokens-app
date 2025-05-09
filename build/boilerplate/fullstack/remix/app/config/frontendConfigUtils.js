import { SuperTokensConfig as STConfig, PreBuiltUIList as STPreBuiltUIList } from "./frontend";
export const frontendConfig = () => {
    return {
        ...STConfig,
    };
};
// Removed unused recipeDetails export
export const PreBuiltUIList = STPreBuiltUIList;

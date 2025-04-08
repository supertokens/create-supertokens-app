import { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";
import { SuperTokensConfig as STConfig, PreBuiltUIList as STPreBuiltUIList } from "./frontend";

export const frontendConfig = (): SuperTokensConfig => {
    return {
        ...STConfig,
    };
};

// Removed unused recipeDetails export
export const PreBuiltUIList = STPreBuiltUIList;

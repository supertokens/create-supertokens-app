import SuperTokens from "supertokens-node";
import { TypeInput } from "supertokens-node/types";
import { appInfo } from "./appinfo";

export const backendConfig = (): TypeInput => {
    return {
        appInfo,
        supertokens: {
            connectionURI: "https://try.supertokens.io",
        },
        recipeList: [],
    };
}

let initialized = false;
export function ensureSuperTokensInit() {
  if (!initialized) {
    SuperTokens.init(backendConfig());
    initialized = true;
  }
}
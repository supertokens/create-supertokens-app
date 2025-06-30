"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperTokensConfig = void 0;
const appInfo_1 = require("./appInfo");
exports.SuperTokensConfig = {
    framework: "express",
    supertokens: {
        // this is the location of the SuperTokens core.
        connectionURI: "https://try.supertokens.com",
    },
    appInfo: appInfo_1.appInfo,
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [],
    isInServerlessEnv: true,
};

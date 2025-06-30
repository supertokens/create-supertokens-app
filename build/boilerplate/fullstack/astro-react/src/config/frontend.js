"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreBuiltUIList = exports.recipeDetails = exports.frontendConfig = void 0;
const appInfo_1 = require("./appInfo");
const frontendConfig = () => {
    return {
        appInfo: appInfo_1.appInfo,
        recipeList: [],
    };
};
exports.frontendConfig = frontendConfig;
exports.recipeDetails = {
    docsLink: "https://supertokens.com/docs/thirdpartyemailpassword/introduction",
};
exports.PreBuiltUIList = [];

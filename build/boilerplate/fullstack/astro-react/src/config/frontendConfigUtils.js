"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreBuiltUIList = exports.recipeDetails = exports.frontendConfig = void 0;
const frontend_1 = require("./frontend");
const frontendConfig = () => {
    return {
        ...frontend_1.SuperTokensConfig,
    };
};
exports.frontendConfig = frontendConfig;
exports.recipeDetails = {
    docsLink: "https://supertokens.com/docs/thirdpartypasswordless/introduction",
};
exports.PreBuiltUIList = frontend_1.PreBuiltUIList;

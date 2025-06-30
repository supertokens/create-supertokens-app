"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreBuiltUIList = exports.recipeDetails = exports.frontendConfig = exports.setRouter = void 0;
const frontend_1 = require("./frontend");
const routerInfo = {};
function setRouter(router, pathName) {
    routerInfo.router = router;
    routerInfo.pathName = pathName;
}
exports.setRouter = setRouter;
const frontendConfig = () => {
    return {
        ...frontend_1.SuperTokensConfig,
        windowHandler: (orig) => {
            return {
                ...orig,
                location: {
                    ...orig.location,
                    getPathName: () => routerInfo.pathName,
                    assign: (url) => routerInfo.router.push(url.toString()),
                    setHref: (url) => routerInfo.router.push(url.toString()),
                },
            };
        },
    };
};
exports.frontendConfig = frontendConfig;
exports.recipeDetails = {
    docsLink: "https://supertokens.com/docs/thirdpartypasswordless/introduction",
};
exports.PreBuiltUIList = frontend_1.PreBuiltUIList;

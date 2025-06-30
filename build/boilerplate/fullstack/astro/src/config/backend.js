"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureSuperTokensInit = exports.backendConfig = void 0;
const appInfo_1 = require("./appInfo");
const supertokens_node_1 = __importDefault(require("supertokens-node"));
const backendConfig = () => {
    return {
        appInfo: appInfo_1.appInfo,
        supertokens: {
            connectionURI: "https://try.supertokens.io",
        },
        recipeList: [],
    };
};
exports.backendConfig = backendConfig;
let initialized = false;
function ensureSuperTokensInit() {
    if (!initialized) {
        supertokens_node_1.default.init((0, exports.backendConfig)());
        initialized = true;
    }
}
exports.ensureSuperTokensInit = ensureSuperTokensInit;

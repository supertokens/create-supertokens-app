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
const base_1 = require("../../../../shared/config/base"); // Corrected import path
const backendConfig = () => {
    return {
        appInfo: appInfo_1.appInfo,
        supertokens: {
            connectionURI: base_1.config.connectionURI, // Use shared config value
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

"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureSuperTokensInit = exports.backendConfig = void 0;
const supertokens_node_1 = __importDefault(require("supertokens-node"));
const backend_1 = require("./backend");
let backendConfig = () => {
    return {
        supertokens: {
            // this is the location of the SuperTokens core.
            connectionURI: backend_1.SuperTokensConfig.supertokens.connectionURI,
        },
        appInfo: backend_1.SuperTokensConfig.appInfo,
        // recipeList contains all the modules that you want to
        // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
        recipeList: backend_1.SuperTokensConfig.recipeList,
        isInServerlessEnv: true,
        framework: "custom",
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

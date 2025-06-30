"use client";
"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperTokensProvider = void 0;
const react_1 = __importDefault(require("react"));
const supertokens_auth_react_1 = require("supertokens-auth-react");
const supertokens_auth_react_2 = __importDefault(require("supertokens-auth-react"));
const frontendConfigUtils_1 = require("../config/frontendConfigUtils");
const navigation_1 = require("next/navigation");
if (typeof window !== "undefined") {
    // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'
    supertokens_auth_react_2.default.init((0, frontendConfigUtils_1.frontendConfig)());
}
const SuperTokensProvider = ({ children }) => {
    (0, frontendConfigUtils_1.setRouter)(
        (0, navigation_1.useRouter)(),
        (0, navigation_1.usePathname)() || window.location.pathname
    );
    return <supertokens_auth_react_1.SuperTokensWrapper>{children}</supertokens_auth_react_1.SuperTokensWrapper>;
};
exports.SuperTokensProvider = SuperTokensProvider;

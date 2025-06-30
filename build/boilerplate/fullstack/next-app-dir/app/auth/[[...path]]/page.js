"use client";
"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const supertokens_auth_react_1 = require("supertokens-auth-react");
const ui_1 = __importDefault(require("supertokens-auth-react/ui"));
const frontend_1 = require("../../config/frontend");
function Auth() {
    // if the user visits a page that is not handled by us (like /auth/random), then we redirect them back to the auth page.
    const [loaded, setLoaded] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (ui_1.default.canHandleRoute(frontend_1.PreBuiltUIList) === false) {
            (0, supertokens_auth_react_1.redirectToAuth)({ redirectBack: false });
        } else {
            setLoaded(true);
        }
    }, []);
    if (loaded) {
        return <>{ui_1.default.getRoutingComponent(frontend_1.PreBuiltUIList)}</>;
    }
    return null;
}
exports.default = Auth;

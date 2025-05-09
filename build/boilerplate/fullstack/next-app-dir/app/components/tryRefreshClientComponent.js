"use client";
"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.TryRefreshComponent = void 0;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const session_1 = __importDefault(require("supertokens-auth-react/recipe/session"));
const supertokens_auth_react_1 = __importDefault(require("supertokens-auth-react"));
const TryRefreshComponent = () => {
    const router = (0, navigation_1.useRouter)();
    const [didError, setDidError] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        void session_1.default
            .attemptRefreshingSession()
            .then((hasSession) => {
                if (hasSession) {
                    router.refresh();
                } else {
                    supertokens_auth_react_1.default.redirectToAuth();
                }
            })
            .catch(() => {
                setDidError(true);
            });
    }, [router]);
    if (didError) {
        return <div>Something went wrong, please reload the page</div>;
    }
    return <div>Loading...</div>;
};
exports.TryRefreshComponent = TryRefreshComponent;

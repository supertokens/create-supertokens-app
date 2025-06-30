"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardPage = void 0;
const headers_1 = require("next/headers");
const tryRefreshClientComponent_1 = require("./tryRefreshClientComponent");
const navigation_1 = require("next/navigation");
const images_1 = require("../../assets/images");
const image_1 = __importDefault(require("next/image"));
const sessionAuthForNextJS_1 = require("./sessionAuthForNextJS");
const util_1 = require("../util");
const dashboardButtons_1 = __importDefault(require("./dashboardButtons"));
async function DashboardPage() {
    const cookiesFromReq = await (0, headers_1.cookies)();
    const cookiesArray = Array.from(cookiesFromReq.getAll()).map(({ name, value }) => ({
        name,
        value,
    }));
    const { accessTokenPayload, hasToken, error } = await (0, util_1.getSessionForSSR)(cookiesArray);
    if (error) {
        return <div>Something went wrong while trying to get the session. Error - {error.message}</div>;
    }
    // `accessTokenPayload` will be undefined if it the session does not exist or has expired
    if (accessTokenPayload === undefined) {
        if (!hasToken) {
            /**
             * This means that the user is not logged in. If you want to display some other UI in this
             * case, you can do so here.
             */
            return (0, navigation_1.redirect)("/auth");
        }
        /**
         * This means that the session does not exist but we have session tokens for the user. In this case
         * the `TryRefreshComponent` will try to refresh the session.
         *
         * To learn about why the 'key' attribute is required refer to: https://github.com/supertokens/supertokens-node/issues/826#issuecomment-2092144048
         */
        return <tryRefreshClientComponent_1.TryRefreshComponent key={Date.now()} />;
    }
    /**
     * SessionAuthForNextJS will handle proper redirection for the user based on the different session states.
     * It will redirect to the login page if the session does not exist etc.
     */
    return (
        <sessionAuthForNextJS_1.SessionAuthForNextJS>
            <div className="main-container">
                <div className="top-band success-title bold-500">
                    <image_1.default src={images_1.CelebrateIcon} alt="Login successful" className="success-icon" />{" "}
                    Login successful
                </div>
                <div className="inner-content">
                    <div>Your userID is:</div>
                    <div className="truncate" id="user-id">
                        {accessTokenPayload.sub}
                    </div>
                    <dashboardButtons_1.default />
                </div>
            </div>
        </sessionAuthForNextJS_1.SessionAuthForNextJS>
    );
}
exports.DashboardPage = DashboardPage;

"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const session_1 = __importDefault(require("supertokens-auth-react/recipe/session"));
const supertokens_auth_react_1 = __importDefault(require("supertokens-auth-react"));
const session_2 = require("supertokens-auth-react/recipe/session");
const images_1 = require("../../assets/images");
const image_1 = __importDefault(require("next/image"));
function Dashboard() {
    const session = (0, session_2.useSessionContext)();
    async function logoutClicked() {
        await session_1.default.signOut();
        supertokens_auth_react_1.default.redirectToAuth();
    }
    async function callAPIClicked() {
        const res = await fetch("/api/user");
        if (res.status === 200) {
            const json = await res.json();
            alert(JSON.stringify(json));
        }
    }
    if (session.loading === true) {
        return null;
    }
    return (
        <session_1.default.SessionAuth>
            <div className="main-container">
                <div className="top-band success-title bold-500">
                    <image_1.default src={images_1.CelebrateIcon} alt="Login successful" className="success-icon" />{" "}
                    Login successful
                </div>
                <div className="inner-content">
                    <div>Your userID is:</div>
                    <div className="truncate" id="user-id">
                        {session.userId}
                    </div>
                    <div className="buttons">
                        <button onClick={callAPIClicked} className="dashboard-button">
                            Call API
                        </button>
                        <button onClick={logoutClicked} className="dashboard-button">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </session_1.default.SessionAuth>
    );
}
exports.default = Dashboard;

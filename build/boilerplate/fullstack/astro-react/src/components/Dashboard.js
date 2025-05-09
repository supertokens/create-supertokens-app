"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const session_1 = require("supertokens-auth-react/recipe/session");
const frontend_1 = require("../config/frontend");
const react_1 = require("react");
const fetchSessionInfo = async () => {
    const response = await fetch((0, frontend_1.getApiDomain)() + "/api/sessioninfo");
    const data = await response.json();
    return data;
};
function Dashboard() {
    const [userId, setUserId] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        const fetchUserId = async () => {
            const data = await fetchSessionInfo();
            setUserId(data.userId);
        };
        fetchUserId();
    }, []);
    async function callAPIClicked() {
        try {
            const data = await fetchSessionInfo();
            window.alert("Session Information:\n" + JSON.stringify(data, null, 2));
        } catch (err) {
            window.alert("Error calling API: " + err.message);
        }
    }
    async function logoutClicked() {
        await (0, session_1.signOut)();
        window.location.href = "/";
    }
    return (
        <>
            <div className="main-container">
                <div className="top-band success-title bold-500">
                    <img src="/assets/images/celebrate-icon.svg" alt="Login successful" className="success-icon" />
                    Login successful
                </div>
                <div className="inner-content">
                    <div>Your userID is:</div>
                    <div className="truncate" id="user-id">
                        {userId}
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
        </>
    );
}
exports.default = Dashboard;

import { useSessionContext, signOut } from "supertokens-auth-react/recipe/session";
import { getApiDomain } from "../config";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();
    const sessionContext = useSessionContext();

    async function callAPIClicked() {
        try {
            const response = await fetch(getApiDomain() + "/sessioninfo");
            const data = await response.json();
            window.alert("Session Information:\n" + JSON.stringify(data, null, 2));
        } catch (err) {
            window.alert("Error calling API: " + err.message);
        }
    }

    async function logoutClicked() {
        await signOut();
        navigate("/");
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
                        {sessionContext.userId}
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

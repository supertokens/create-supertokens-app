import { signOut } from "supertokens-auth-react/recipe/session";
import { getApiDomain } from "../config/frontend";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const fetchSessionInfo = async () => {
            const response = await fetch(getApiDomain() + "/sessioninfo");
            const data = await response.json();
            setUserId(data.userId);
        };
        fetchSessionInfo();
    }, []);

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

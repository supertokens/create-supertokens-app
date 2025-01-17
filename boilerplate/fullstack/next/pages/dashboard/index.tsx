import React from "react";
import SessionReact from "supertokens-auth-react/recipe/session";
import SuperTokensReact from "supertokens-auth-react";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { CelebrateIcon } from "../../assets/images";
import Image from "next/image";

export default function Dashboard() {
    const session = useSessionContext();

    async function logoutClicked() {
        await SessionReact.signOut();
        SuperTokensReact.redirectToAuth();
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
        <SessionReact.SessionAuth>
            <div className="main-container">
                <div className="top-band success-title bold-500">
                    <Image src={CelebrateIcon} alt="Login successful" className="success-icon" /> Login successful
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
        </SessionReact.SessionAuth>
    );
}

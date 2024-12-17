import { useState } from "react";
import { signOut } from "supertokens-auth-react/recipe/session";

interface Props {
    userId: string;
}

export default function DashboardContent({ userId }: Props) {
    async function callAPIClicked() {
        try {
            const response = await fetch("/api/sessioninfo");
            const data = await response.json();
            window.alert("Session Information:\n" + JSON.stringify(data, null, 2));
        } catch (err) {
            window.alert("Error calling API: " + (err as Error).message);
        }
    }

    async function logoutClicked() {
        await signOut();
        window.location.href = "/";
    }

    return (
        <div className="buttons">
            <button onClick={callAPIClicked} className="dashboard-button">
                Call API
            </button>
            <button onClick={logoutClicked} className="dashboard-button">
                Logout
            </button>
        </div>
    );
}

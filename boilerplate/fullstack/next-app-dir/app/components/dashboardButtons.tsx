"use client";

import { signOut } from "supertokens-auth-react/recipe/session";
import { useRouter } from "next/navigation";

export default function DashboardButtons() {
    const router = useRouter();

    const callAPIClicked = async () => {
        const userInfoResponse = await fetch("http://localhost:3000/api/user");
        alert(JSON.stringify(await userInfoResponse.json()));
    };

    async function logoutClicked() {
        await signOut();
        router.push("/");
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

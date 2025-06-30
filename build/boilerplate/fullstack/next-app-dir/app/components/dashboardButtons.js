"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const session_1 = require("supertokens-auth-react/recipe/session");
const navigation_1 = require("next/navigation");
function DashboardButtons() {
    const router = (0, navigation_1.useRouter)();
    const callAPIClicked = async () => {
        const userInfoResponse = await fetch("http://localhost:3000/api/user");
        alert(JSON.stringify(await userInfoResponse.json()));
    };
    async function logoutClicked() {
        await (0, session_1.signOut)();
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
exports.default = DashboardButtons;

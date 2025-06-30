import { Component, createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import * as Session from "supertokens-web-js/recipe/session";

const Dashboard: Component = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = createSignal<string | null>(null);

    onMount(async () => {
        try {
            const id = await Session.getUserId();
            setUserId(id);
        } catch (err) {
            navigate("/auth");
        }
    });

    async function callAPIClicked() {
        try {
            const apiPort = import.meta.env.VITE_APP_API_PORT || 3001;
            const apiUrl = import.meta.env.VITE_APP_API_URL || `http://localhost:${apiPort}`;
            const response = await fetch(apiUrl + "/sessioninfo");
            const data = await response.json();
            window.alert("Session Information:\n" + JSON.stringify(data, null, 2));
        } catch (err) {
            window.alert("Error calling API: " + err.message);
        }
    }

    async function logoutClicked() {
        await Session.signOut();
        navigate("/");
    }

    return (
        <>
            <div class="main-container">
                <div class="top-band success-title bold-500">
                    <img src="/assets/images/celebrate-icon.svg" alt="Login successful" class="success-icon" />
                    Login successful
                </div>
                <div class="inner-content">
                    <div>Your userID is:</div>
                    <div class="truncate" id="user-id">
                        {userId()}
                    </div>
                    <div class="buttons">
                        <button onClick={callAPIClicked} class="dashboard-button">
                            Call API
                        </button>
                        <button onClick={logoutClicked} class="dashboard-button">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;

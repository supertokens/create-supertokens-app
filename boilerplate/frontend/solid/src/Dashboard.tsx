import { Component, createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import * as Session from "supertokens-web-js/recipe/session";
import { getApiDomain } from "./config";

const Dashboard: Component = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = createSignal<string | null>(null);
    const [showAPIResponse, setShowAPIResponse] = createSignal(false);
    const [apiResponse, setApiResponse] = createSignal<string>("");

    onMount(async () => {
        try {
            const id = await Session.getUserId();
            setUserId(id);
        } catch (err) {
            navigate("/auth");
        }
    });

    const handleSignOut = async () => {
        await Session.signOut();
        navigate("/");
    };

    const callExampleAPI = async () => {
        try {
            const response = await fetch(getApiDomain() + "/sessioninfo");
            const json = await response.json();
            setApiResponse(JSON.stringify(json, null, 2));
            setShowAPIResponse(true);
        } catch (err) {
            if (err.status === 401) {
                navigate("/auth");
            }
        }
    };

    return (
        <div class="fill">
            <div class="content">
                <div class="top-content">
                    <h1>Dashboard</h1>
                    <div class="user-info">
                        <p>User ID: {userId()}</p>
                        <button onClick={handleSignOut}>Sign Out</button>
                    </div>
                    <div class="api-section">
                        <button onClick={callExampleAPI}>Call example API</button>
                        {showAPIResponse() && (
                            <div class="api-response">
                                <p>API Response:</p>
                                <pre>{apiResponse()}</pre>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

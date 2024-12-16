import { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";

const Home: Component = () => {
    const navigate = useNavigate();

    return (
        <div class="fill">
            <div class="content">
                <div class="top-content">
                    <h1>Welcome to SuperTokens 👋</h1>
                    <div class="button-container">
                        <button class="login-button" onClick={() => navigate("/auth")}>
                            Login
                        </button>
                        <button class="dashboard-button" onClick={() => navigate("/dashboard")}>
                            View Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

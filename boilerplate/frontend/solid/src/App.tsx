import { Component, onMount } from "solid-js";
import { Router, Routes, Route, useNavigate } from "@solidjs/router";
import { SuperTokensConfig, ComponentWrapper } from "../config/emailpassword";
import Home from "./Home";
import Dashboard from "./Dashboard";
import { Auth } from "./Auth";
import { initSuperTokensWebJS } from "../config/emailpassword";
import * as Session from "supertokens-web-js/recipe/session";

// Initialize SuperTokens
initSuperTokensWebJS();

const ProtectedRoute: Component<{ component: Component }> = (props) => {
    const navigate = useNavigate();

    onMount(async () => {
        if (!(await Session.doesSessionExist())) {
            navigate("/auth");
        }
    });

    return <props.component />;
};

const App: Component = () => {
    return (
        <>
            <header>
                <div class="header-container">
                    <a href="/">
                        <img src="/ST.svg" alt="SuperTokens" />
                    </a>
                </div>
                <div class="header-container-right">
                    <a href="https://supertokens.com/docs/guides/getting-started/react" target="_blank">
                        Docs
                    </a>
                    <a href="https://github.com/supertokens/create-supertokens-app" target="_blank">
                        CLI Repo
                    </a>
                </div>
            </header>
            <ComponentWrapper>
                <div class="App app-container">
                    <Router>
                        <div class="fill">
                            <Routes>
                                <Route path="/" component={Home} />
                                <Route path="/auth/*" component={Auth} />
                                <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
                            </Routes>
                        </div>
                    </Router>
                </div>
            </ComponentWrapper>
        </>
    );
};

export default App;

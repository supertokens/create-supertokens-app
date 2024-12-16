import { Component, onMount } from "solid-js";
import { Router, Routes, Route, useNavigate, A } from "@solidjs/router";
import { SuperTokensConfig, ComponentWrapper, initSuperTokensWebJS } from "./config";
import Home from "./Home";
import Dashboard from "./Dashboard";
import { Auth } from "./Auth";
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
        <ComponentWrapper>
            <Router>
                <main class="App app-container">
                    <header>
                        <nav class="header-container">
                            <A href="/">
                                <img src="/ST.svg" alt="SuperTokens" />
                            </A>
                            <ul class="header-container-right">
                                <li>
                                    <a
                                        href="https://supertokens.com/docs/guides/getting-started/react"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Docs
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://github.com/supertokens/create-supertokens-app"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        CLI Repo
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </header>
                    <div class="fill" id="home-container">
                        <Routes>
                            <Route path="/" component={Home} />
                            <Route path="/auth/*" component={Auth} />
                            <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
                        </Routes>
                        <footer>
                            Built with ❤️ by the folks at{" "}
                            <a href="https://supertokens.io" target="_blank" rel="noopener noreferrer">
                                supertokens.com
                            </a>
                            .
                        </footer>
                        <img class="separator-line" src="/assets/images/separator-line.svg" alt="separator" />
                    </div>
                </main>
            </Router>
        </ComponentWrapper>
    );
};

export default App;

import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import * as ReactRouter from "react-router-dom";
import Dashboard from "./Dashboard";
import { PreBuiltUIList, SuperTokensConfig, ComponentWrapper } from "./config";
import Home from "./Home";

// Initialize SuperTokens - ideally in the global scope
SuperTokens.init(SuperTokensConfig);

function App() {
    return (
        <SuperTokensWrapper>
            <BrowserRouter>
                <main className="App app-container">
                    <header>
                        <nav className="header-container">
                            <Link to="/">
                                <img src="/ST.svg" alt="SuperTokens" />
                            </Link>
                            <ul className="header-container-right">
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
                    <ComponentWrapper>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            {/* This shows the login UI on "/auth" route */}
                            {getSuperTokensRoutesForReactRouterDom(ReactRouter, PreBuiltUIList)}

                            {/* This protects the "/dashboard" route so that it shows
                            <Dashboard /> only if the user is logged in.
                            Else it redirects the user to "/auth" */}
                            <Route
                                path="/dashboard"
                                element={
                                    <SessionAuth>
                                        <Dashboard />
                                    </SessionAuth>
                                }
                            />
                        </Routes>
                    </ComponentWrapper>
                </main>
            </BrowserRouter>
        </SuperTokensWrapper>
    );
}

export default App;

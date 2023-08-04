import "./App.css";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Home";
import { SuperTokensConfig } from "./config";
import { Auth } from "./Auth";

SuperTokens.init(SuperTokensConfig);

function App() {
    /*
     * We override the pre built UI to show the ChangeTenantsButton along with the rest of the
     * login form. This component allows users to go back and select another tenant without logging in
     */
    return (
        <SuperTokensWrapper>
            <div className="App app-container">
                <Router>
                    <Routes>
                        {/*
                         * The Auth component handles showing the tenant dropdown
                         * to users who are not logged in. It also handles showing
                         * the pre built UI provided by SuperTokens after users have
                         * selected a tenant
                         */}
                        <Route path="/auth/*" element={<Auth />} />

                        <Route
                            path="/"
                            element={
                                /* This protects the "/" route so that it shows
                                <Home /> only if the user is logged in.
                                Else it redirects the user to "/auth" */
                                <SessionAuth>
                                    <Home />
                                </SessionAuth>
                            }
                        />
                    </Routes>
                </Router>
            </div>
        </SuperTokensWrapper>
    );
}

export default App;

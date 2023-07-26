import "./App.css";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Home";
import { SuperTokensConfig } from "./config";
import { ThirdpartyEmailPasswordComponentsOverrideProvider } from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { ThirdpartyPasswordlessComponentsOverrideProvider } from "supertokens-auth-react/recipe/thirdpartypasswordless";
import { Auth } from "./Auth";

SuperTokens.init(SuperTokensConfig);

// We display this component as part of the SuperTokens login form to
// allow users to go back and select another tenant without logging in
const ChangeTenantsButton = () => {
    return (
        <div
            data-supertokens="link tenants-link"
            onClick={() => {
                localStorage.removeItem("tenantId");
                window.location.reload();
            }}
        >
            Log in to a different organisation
        </div>
    );
};

function App() {
    /*
     * We override the pre built UI to show the ChangeTenantsButton along with the rest of the
     * login form. This component allows users to go back and select another tenant without logging in
     */
    return (
        <SuperTokensWrapper>
            <ThirdpartyEmailPasswordComponentsOverrideProvider
                components={{
                    EmailPasswordSignInFooter_Override: ({ DefaultComponent, ...props }) => {
                        return (
                            <div>
                                <DefaultComponent {...props} />
                                <ChangeTenantsButton />
                            </div>
                        );
                    },
                }}
            >
                <ThirdpartyPasswordlessComponentsOverrideProvider
                    components={{
                        PasswordlessSignInUpFooter_Override: ({ DefaultComponent, ...props }) => {
                            return (
                                <div>
                                    <DefaultComponent {...props} />
                                    <ChangeTenantsButton />
                                </div>
                            );
                        },
                    }}
                >
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
                </ThirdpartyPasswordlessComponentsOverrideProvider>
            </ThirdpartyEmailPasswordComponentsOverrideProvider>
        </SuperTokensWrapper>
    );
}

export default App;

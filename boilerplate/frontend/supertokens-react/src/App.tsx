import './App.css';
import SuperTokens, { SuperTokensWrapper, getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Home";
import { AuthWrapper, SuperTokensConfig } from "./config";

SuperTokens.init(SuperTokensConfig);

function App() {
  return (
      <SuperTokensWrapper>
          <div className="App">
              <Router>
                  <div className="fill">
                      <Routes>
                          {/* This shows the login UI on "/auth" route */}
                          {getSuperTokensRoutesForReactRouterDom(require("react-router-dom"))}

                          <Route
                              path="/"
                              element={
                                  /* This protects the "/" route so that it shows
                                  <Home /> only if the user is logged in.
                                  Else it redirects the user to "/auth" */
                                  <AuthWrapper>
                                      <Home />
                                  </AuthWrapper>
                              }
                          />
                      </Routes>
                  </div>
              </Router>
          </div>
      </SuperTokensWrapper>
  );
}

export default App;

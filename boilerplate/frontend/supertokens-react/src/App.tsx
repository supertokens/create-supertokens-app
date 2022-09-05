import { useState } from "react";
import './App.css';
import SuperTokens, { SuperTokensWrapper, getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import Footer from "./Footer";
import SessionExpiredPopup from "./SessionExpiredPopup";
import Home from "./Home";
import { AuthWrapper, recipeList } from "./config";

export function getApiDomain() {
  const apiPort = process.env.REACT_APP_API_PORT || 3001;
  const apiUrl = process.env.REACT_APP_API_URL || `http://localhost:${apiPort}`;
  return apiUrl;
}

export function getWebsiteDomain() {
  const websitePort = process.env.REACT_APP_WEBSITE_PORT || 3000;
  const websiteUrl = process.env.REACT_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
  return websiteUrl;
}

SuperTokens.init({
  appInfo: {
      appName: "SuperTokens Demo App", // TODO: Your app name
      apiDomain: getApiDomain(), // TODO: Change to your app's API domain
      websiteDomain: getWebsiteDomain(), // TODO: Change to your app's website domain
  },
  recipeList,
});

function App() {
  let [showSessionExpiredPopup, updateShowSessionExpiredPopup] = useState(false);

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
                                  // TODO: Use latest(session claims branch) and use session auth instead
                                  <AuthWrapper
                                      onSessionExpired={() => {
                                          updateShowSessionExpiredPopup(true);
                                      }}>
                                      <Home />
                                      {showSessionExpiredPopup && <SessionExpiredPopup />}
                                  </AuthWrapper>
                              }
                          />
                      </Routes>
                  </div>
                  <Footer />
              </Router>
          </div>
      </SuperTokensWrapper>
  );
}

export default App;

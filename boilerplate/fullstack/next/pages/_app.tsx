import "../styles/globals.css";
import React from "react";
import { useEffect } from "react";
import SuperTokensReact, { SuperTokensWrapper } from "supertokens-auth-react";
import * as SuperTokensConfig from "../config/frontendConfig";
import Session from "supertokens-auth-react/recipe/session";

if (typeof window !== "undefined") {
    SuperTokensReact.init(SuperTokensConfig.frontendConfig());
}

function MyApp({ Component, pageProps }): JSX.Element {
    useEffect(() => {
        async function doRefresh() {
            if (pageProps.fromSupertokens === "needs-refresh") {
                if (await Session.attemptRefreshingSession()) {
                    location.reload();
                } else {
                    // user has been logged out
                    SuperTokensReact.redirectToAuth();
                }
            }
        }
        doRefresh();
    }, [pageProps.fromSupertokens]);
    if (pageProps.fromSupertokens === "needs-refresh") {
        return null;
    }

    return (
        <div className={`app-wrapper`}>
            <SuperTokensWrapper>
                <header>
                    <div className="header-container">
                        <a href="/">
                            <img src="/ST.svg" alt="SuperTokens" />
                        </a>
                    </div>
                    <div className="header-container-right">
                        <a href="https://supertokens.com/docs/emailpassword/nextjs/about" target="_blank">
                            Docs
                        </a>
                        <a href="https://github.com/supertokens/create-supertokens-app" target="_blank">
                            CLI Repo
                        </a>
                    </div>
                </header>
                <div className="App app-container">
                    <div className="fill">
                        <Component {...pageProps} />
                    </div>
                </div>
            </SuperTokensWrapper>
        </div>
    );
}

export default MyApp;

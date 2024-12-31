import { Meta, Links, Scripts, Outlet, ScrollRestoration, useLocation } from "@remix-run/react";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { frontendConfig } from "./config/frontend";
import { SessionAuth } from "supertokens-auth-react/recipe/session/index.js";
import type { LinksFunction } from "@remix-run/node";
import appStylesHref from "./app.css?url";
export const links: LinksFunction = () => [{ rel: "stylesheet", href: appStylesHref }];

if (typeof window !== "undefined") {
    SuperTokens.init(frontendConfig());
}

export default function App() {
    const location = useLocation();
    const isUnprotectedRoute = location.pathname.startsWith("/") || location.pathname.startsWith("/auth");

    return (
        <html lang="en">
            <head>
                <Meta />
                <Links />
            </head>
            <body className="app-wrapper">
                <SuperTokensWrapper>
                    <header>
                        <div className="header-container">
                            <a href="/">
                                <img src="/ST.svg" alt="SuperTokens" />
                            </a>
                        </div>
                        <div className="header-container-right">
                            <a href="https://supertokens.com/docs/guides/getting-started/react" target="_blank">
                                Docs
                            </a>
                            <a href="https://github.com/supertokens/create-supertokens-app" target="_blank">
                                CLI Repo
                            </a>
                        </div>
                    </header>
                    <div className="App app-container">
                        <div className="fill">
                            {isUnprotectedRoute ? (
                                <Outlet />
                            ) : (
                                <SessionAuth>
                                    <Outlet />
                                </SessionAuth>
                            )}

                            <ScrollRestoration />
                            <Scripts />
                        </div>
                    </div>
                </SuperTokensWrapper>
            </body>
        </html>
    );
}

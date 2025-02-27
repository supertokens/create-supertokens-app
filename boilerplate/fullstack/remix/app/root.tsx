import { Meta, Links, Scripts, Outlet, ScrollRestoration, useLocation, Link } from "@remix-run/react";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { frontendConfig } from "./config/frontendConfigUtils";
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
            <body>
                <SuperTokensWrapper>
                    <div className="App app-container">
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
                        <div className="fill" id="home-container">
                            {isUnprotectedRoute ? (
                                <Outlet />
                            ) : (
                                <SessionAuth>
                                    <Outlet />
                                </SessionAuth>
                            )}

                            <ScrollRestoration />
                            <Scripts />
                            <footer>
                                Built with ❤️ by the folks at{" "}
                                <a href="https://supertokens.io" target="_blank" rel="noopener noreferrer">
                                    supertokens.com
                                </a>
                                .
                            </footer>
                            <img className="separator-line" src="../assets/images/separator-line.svg" alt="separator" />
                        </div>
                    </div>
                </SuperTokensWrapper>
            </body>
        </html>
    );
}

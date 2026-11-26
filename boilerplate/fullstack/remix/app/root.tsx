import { Meta, Links, Scripts, Outlet, ScrollRestoration, Link, type LinksFunction } from "react-router";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { frontendConfig } from "./config/frontendConfigUtils";
import appStylesHref from "./app.css?url";
import { ComponentWrapper } from "./config/frontend";
import separatorLine from "../assets/images/separator-line.svg";
export const links: LinksFunction = () => [{ rel: "stylesheet", href: appStylesHref }];

if (typeof window !== "undefined") {
    SuperTokens.init(frontendConfig());
}

export default function App() {
    return (
        <html lang="en">
            <head>
                <Meta />
                <Links />
            </head>
            <body>
                <SuperTokensWrapper>
                    <div className="App app-container">
                        {/* Demo-only banner — remove once connectionURI points at your own SuperTokens core. */}
                        <div className="demo-warning-banner">
                            <strong>Demo mode:</strong> This app is configured to use the public SuperTokens core at
                            try.supertokens.com. Data submitted here may be visible to other users of the demo. Update{" "}
                            <code>connectionURI</code> in your backend config before using this app for anything real.
                        </div>
                        <header>
                            <nav className="header-container">
                                <Link to="/">
                                    <img src="/ST.svg" alt="SuperTokens" />
                                </Link>
                                <ul className="header-container-right">
                                    <li>
                                        <a
                                            href="https://supertokens.com/docs//"
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
                            <ComponentWrapper>
                                <>
                                    <Outlet />

                                    <ScrollRestoration />
                                    <Scripts />
                                    <footer>
                                        Built with ❤️ by the folks at{" "}
                                        <a href="https://supertokens.io" target="_blank" rel="noopener noreferrer">
                                            supertokens.com
                                        </a>
                                        .
                                    </footer>
                                    <img className="separator-line" src={separatorLine} alt="separator" />
                                </>
                            </ComponentWrapper>
                        </div>
                    </div>
                </SuperTokensWrapper>
            </body>
        </html>
    );
}

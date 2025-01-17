import "../styles/globals.css";
import { useEffect } from "react";
import SuperTokensReact, { SuperTokensWrapper } from "supertokens-auth-react";
import * as SuperTokensConfig from "../config/frontendConfig";
import Session from "supertokens-auth-react/recipe/session";
import Link from "next/link";
import Image from "next/image";
import { SeparatorLine } from "../assets/images";

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
        <div className="App app-container">
            <SuperTokensWrapper>
                <header>
                    <nav className="header-container">
                        <Link href="/">
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
                    <Component {...pageProps} />
                    <footer>
                        Built with ❤️ by the folks at{" "}
                        <a href="https://supertokens.io" target="_blank" rel="noopener noreferrer">
                            supertokens.com
                        </a>
                        .
                    </footer>
                    <Image className="separator-line" src={SeparatorLine} alt="separator" />
                </div>
            </SuperTokensWrapper>
        </div>
    );
}

export default MyApp;

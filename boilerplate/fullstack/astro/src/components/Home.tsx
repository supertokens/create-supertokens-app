import { recipeDetails } from "../config/frontend";
import SuperTokens from "supertokens-auth-react";
import SessionReact from "supertokens-auth-react/recipe/session/index.js";
import { TryRefreshComponent } from "../components/tryRefreshClientComponent";
import { SessionAuthForAstro } from "./sessionAuthForAstro";

interface SessionProps {
    userId: string;
    sessionHandle: string;
    accessTokenPayload: object;
}

export default function Home({
    session,
    hasInvalidClaims,
    hasToken,
}: {
    session: SessionProps | undefined;
    hasInvalidClaims: boolean;
    hasToken: boolean;
}) {
    async function logoutClicked() {
        await SessionReact.signOut();
        SuperTokens.redirectToAuth();
    }

    if (session === undefined) {
        if (!hasToken) {
            location.href = "/auth";
            return;
        }
        if (hasInvalidClaims) {
            return <SessionAuthForAstro />;
        } else {
            // To learn about why the 'key' attribute is required refer to: https://github.com/supertokens/supertokens-node/issues/826#issuecomment-2092144048
            return <TryRefreshComponent key={Date.now()} />;
        }
    }

    const displaySessionInformationWindow = (sessionData: SessionProps) => {
        window.alert("Session Information: " + JSON.stringify(sessionData));
    };

    const links: {
        name: string;
        link: string;
        icon: string;
    }[] = [
        {
            name: "Blogs",
            link: "https://supertokens.com/blog",
            icon: "/assets/images/blogs-icon.svg",
        },
        {
            name: "Guides",
            link: recipeDetails.docsLink,
            icon: "/assets/images/guide-icon.svg",
        },
        {
            name: "Sign Out",
            link: "",
            icon: "/assets/images/sign-out-icon.svg",
        },
    ];

    return (
        <SessionAuthForAstro>
            <div className="homeContainer">
                <div className="mainContainer">
                    <div className="topBand successTitle bold500">
                        <img src="/assets/images/celebrate-icon.svg" alt="Login successful" className="successIcon" />
                        Login successful
                    </div>
                    <div className="innerContent">
                        <div>Your userID is: </div>

                        <div className="truncate userId">{session.userId}</div>

                        <button onClick={() => displaySessionInformationWindow(session)} className="sessionButton">
                            Call API
                        </button>
                    </div>
                </div>

                <div className="bottomLinksContainer">
                    {links.map((link) => {
                        if (link.name === "Sign Out") {
                            return (
                                <button
                                    key={link.name}
                                    className="linksContainerLink signOutLink"
                                    onClick={logoutClicked}
                                >
                                    <img src={link.icon} alt={link.name} className="linkIcon" />
                                    <div role="button">{link.name}</div>
                                </button>
                            );
                        }
                        return (
                            <a href={link.link} className="linksContainerLink" key={link.name}>
                                <img src={link.icon} alt={link.name} className="linkIcon" />
                                <div role="button">{link.name}</div>
                            </a>
                        );
                    })}
                </div>

                <img className="separatorLine" src="/assets/images/separator-line.svg" alt="separator" />
            </div>
        </SessionAuthForAstro>
    );
}

import { recipeDetails } from "../config/frontend";
import SuperTokens from "supertokens-auth-react";
import SessionReact from "supertokens-auth-react/recipe/session/index.js";
import { TryRefreshComponent } from "../components/tryRefreshClientComponent";
import { SessionAuthForAstro } from "./sessionAuthForAstro";
import type { JWTPayload } from "jose";

export default function Home({
    accessTokenPayload,
    hasToken,
    error,
}: {
    accessTokenPayload: JWTPayload | undefined;
    hasToken: boolean;
    error: Error | undefined;
}) {
    async function logoutClicked() {
        await SessionReact.signOut();
        SuperTokens.redirectToAuth();
    }

    if (error) {
        return <div>Something went wrong while trying to get the session. Error - {error.message}</div>;
    }

    // `accessTokenPayload` will be undefined if it the session does not exist or has expired
    if (accessTokenPayload === undefined) {
        /**
         * This means that the user is not logged in. If you want to display some other UI in this
         * case, you can do so here.
         */
        if (!hasToken) {
            location.href = "/auth";
            return;
        }

        /**
         * This means that the session does not exist but we have session tokens for the user. In this case
         * the `TryRefreshComponent` will try to refresh the session.
         *
         * To learn about why the 'key' attribute is required refer to: https://github.com/supertokens/supertokens-node/issues/826#issuecomment-2092144048
         */
        return <TryRefreshComponent key={Date.now()} />;
    }

    const fetchUserData = async () => {
        const userInfoResponse = await fetch("http://localhost:4321/sessioninfo");

        alert(JSON.stringify(await userInfoResponse.json()));
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

    /**
     * SessionAuthForAstro will handle proper redirection for the user based on the different session states.
     * It will redirect to the login page if the session does not exist etc.
     */
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

                        <div className="truncate userId">{accessTokenPayload.sub}</div>

                        <button onClick={() => fetchUserData()} className="sessionButton">
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

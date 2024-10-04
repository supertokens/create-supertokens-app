import { CelebrateIcon, SeparatorLine, BlogsIcon, GuideIcon, SignOutIcon } from "../../assets/images";
import { recipeDetails } from "../config/frontend";
import SuperTokens from "supertokens-auth-react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import SessionReact from "supertokens-auth-react/recipe/session/index.js";
import { getSessionForSSR } from "supertokens-node/customframework";
import { TryRefreshComponent } from "../components/tryRefreshClientComponent";
import { SessionAuthForRemix } from "../components/sessionAuthForRemix";
import type { JWTPayload } from "jose";

export async function loader({ request }: LoaderFunctionArgs): Promise<{
    accessTokenPayload: JWTPayload | undefined;
    hasToken: boolean;
    error: Error | undefined;
}> {
    return getSessionForSSR(request);
}

export default function Home() {
    const navigate = useNavigate();

    const { accessTokenPayload, hasToken, error } = useLoaderData<{
        accessTokenPayload: JWTPayload | undefined;
        hasToken: boolean;
        error: Error | undefined;
    }>();

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
            return navigate("/auth");
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
        const userInfoResponse = await fetch("http://localhost:3000/sessioninfo");

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
            icon: BlogsIcon,
        },
        {
            name: "Guides",
            link: recipeDetails.docsLink,
            icon: GuideIcon,
        },
        {
            name: "Sign Out",
            link: "",
            icon: SignOutIcon,
        },
    ];

    /**
     * SessionAuthForRemix will handle proper redirection for the user based on the different session states.
     * It will redirect to the login page if the session does not exist etc.
     */
    return (
        <SessionAuthForRemix>
            <div className="homeContainer">
                <div className="mainContainer">
                    <div className="topBand successTitle bold500">
                        <img src={CelebrateIcon} alt="Login successful" className="successIcon" />
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

                <img className="separatorLine" src={SeparatorLine} alt="separator" />
            </div>
        </SessionAuthForRemix>
    );
}

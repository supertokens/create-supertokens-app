import { CelebrateIcon, SeparatorLine, BlogsIcon, GuideIcon, SignOutIcon } from "../../assets/images";
import { recipeDetails } from "../config/frontend";
import SuperTokens from "supertokens-auth-react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import SessionReact from "supertokens-auth-react/recipe/session/index.js";
import { getSessionForSSR } from "../superTokensHelpers";
import { TryRefreshComponent } from "../components/tryRefreshClientComponent";
import { SessionAuthForRemix } from "../components/sessionAuthForRemix";

interface SessionProps {
    userId: string;
    sessionHandle: string;
    accessTokenPayload: object;
}

export async function loader({ request }: LoaderFunctionArgs): Promise<{
    session: SessionProps | undefined;
    hasInvalidClaims: boolean;
    hasToken: boolean;
}> {
    const { session, hasInvalidClaims, hasToken } = await getSessionForSSR(request);

    let sessionProps: SessionProps | undefined = undefined;
    if (session !== undefined) {
        sessionProps = {
            userId: session.getUserId(),
            sessionHandle: session.getHandle(),
            accessTokenPayload: session.getAccessTokenPayload(),
        };
    }

    return {
        session: sessionProps,
        hasInvalidClaims,
        hasToken,
    };
}

export default function Home() {
    const navigate = useNavigate();

    const { session, hasInvalidClaims, hasToken } = useLoaderData<{
        session: SessionProps | undefined;
        hasInvalidClaims: boolean;
        hasToken: boolean;
    }>();

    async function logoutClicked() {
        await SessionReact.signOut();
        SuperTokens.redirectToAuth();
    }

    if (session === undefined) {
        if (!hasToken) {
            return navigate("/auth");
        }
        if (hasInvalidClaims) {
            return <SessionAuthForRemix />;
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

                <img className="separatorLine" src={SeparatorLine} alt="separator" />
            </div>
        </SessionAuthForRemix>
    );
}

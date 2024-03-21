import { CelebrateIcon, SeparatorLine, BlogsIcon, GuideIcon, SignOutIcon } from "../../assets/images";
import { recipeDetails } from "../config/frontend";
import SuperTokens from "supertokens-auth-react";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import SessionReact from "supertokens-auth-react/recipe/session/index.js";
import { getSessionDetails } from "../lib/superTokensHelpers";
import { TryRefreshComponent } from "../components/tryRefreshClientComponent";
import { SessionAuthForRemix } from "../components/sessionAuthForRemix";

interface SessionDataForUI {
    note: string;
    userId: string;
    sessionHandle: string;
    accessTokenPayload: object;
}

interface SessionForRemixProps {
    userId?: string;
    sessionHandle?: string;
    accessTokenPayload: SessionDataForUI;
}

export async function loader({ request }: LoaderFunctionArgs): Promise<{
    session: SessionForRemixProps | undefined;
    hasInvalidClaims: boolean;
    hasToken: boolean;
    RemixResponse: Response | null;
}> {
    const { session, hasInvalidClaims, hasToken, RemixResponse } = await getSessionDetails(request);

    const res: SessionForRemixProps = {
        userId: session?.getUserId(),
        sessionHandle: session?.getHandle(),
        accessTokenPayload: session?.getAccessTokenPayload(),
    };

    if (RemixResponse) {
        return {
            session: res,
            hasInvalidClaims,
            hasToken,
            RemixResponse,
        };
    } else {
        return {
            session: res,
            hasInvalidClaims,
            hasToken,
            RemixResponse: null,
        };
    }
}

export default function Home() {
    const loaderData = useLoaderData<{
        session: SessionForRemixProps | undefined;
        hasInvalidClaims: boolean;
        hasToken: boolean;
        RemixResponse: Response | null;
    }>();

    console.log(loaderData);
    console.log(loaderData.session);

    async function logoutClicked() {
        await SessionReact.signOut();
        SuperTokens.redirectToAuth();
    }

    if (!loaderData.session) {
        if (!loaderData.hasToken) {
            return redirect("/auth");
        }
        if (loaderData.hasInvalidClaims) {
            return <SessionAuthForRemix />;
        } else {
            return <TryRefreshComponent />;
        }
    }
    if (loaderData.session) {
        const sessionData: SessionDataForUI = {
            note: "Retrieve authenticated user-specific data from your application post-verification through the use of the verifySession middleware.",
            userId: loaderData.session?.userId || "",
            sessionHandle: loaderData.session?.accessTokenPayload.sessionHandle,
            accessTokenPayload: loaderData.session?.accessTokenPayload,
        };

        const displaySessionInformationWindow = (sessionData: SessionDataForUI) => {
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

                            <div className="truncate userId">{loaderData.session.userId}</div>

                            <button
                                onClick={() => displaySessionInformationWindow(sessionData)}
                                className="sessionButton"
                            >
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
}

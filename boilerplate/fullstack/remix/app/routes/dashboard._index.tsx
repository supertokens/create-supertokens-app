import { CelebrateIcon, BlogsIcon, GuideIcon, SignOutIcon } from "../../assets/images";
import { useEffect } from "react";
import type { JWTPayload } from "jose";
import { recipeDetails } from "../config/frontend";
import SuperTokens from "supertokens-auth-react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import SessionReact from "supertokens-auth-react/recipe/session/index.js";
import { getSessionForSSR } from "supertokens-node/custom";
import { TryRefreshComponent } from "../components/tryRefreshClientComponent";
import { SessionAuthForRemix } from "../components/sessionAuthForRemix";
import SessionInfo from "../components/sessionInfo";
import Footer from "../components/Footer";

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

    useEffect(() => {
        if (!hasToken && accessTokenPayload === undefined) {
            navigate("/auth");
        }
    }, [hasToken, accessTokenPayload, navigate]);

    async function logoutClicked() {
        await SessionReact.signOut();
        SuperTokens.redirectToAuth();
    }

    function openLink(url: string) {
        window.open(url, "_blank");
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
            return null;
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

    const links = [
        {
            name: "Blogs",
            onClick: () => openLink("https://supertokens.com/blog"),
            icon: BlogsIcon,
        },
        {
            name: "Documentation",
            onClick: () => openLink(recipeDetails.docsLink),
            icon: GuideIcon,
        },
        {
            name: "Sign Out",
            onClick: logoutClicked,
            icon: SignOutIcon,
        },
    ];

    /**
     * SessionAuthForRemix will handle proper redirection for the user based on the different session states.
     * It will redirect to the login page if the session does not exist etc.
     */
    return (
        <SessionAuthForRemix>
            <div className="fill" id="home-container">
                <div className="main-container">
                    <div className="top-band success-title bold-500">
                        <img src={CelebrateIcon} alt="Login successful" className="success-icon" /> Login successful
                    </div>
                    <div className="inner-content">
                        <div>Your userID is:</div>
                        <div className="truncate" id="user-id">
                            {accessTokenPayload.sub}
                        </div>
                        <SessionInfo />
                    </div>
                </div>
                <Footer links={links} />
            </div>
        </SessionAuthForRemix>
    );
}

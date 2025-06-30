import { useEffect } from "react";
import SuperTokens from "supertokens-auth-react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import SessionReact from "supertokens-auth-react/recipe/session/index.js";
import { getSessionForSSR } from "supertokens-node/custom";
import { TryRefreshComponent } from "../components/tryRefreshClientComponent";
import { SessionAuthForRemix } from "../components/sessionAuthForRemix";
export async function loader({ request }) {
    return getSessionForSSR(request);
}
export default function Dashboard() {
    const navigate = useNavigate();
    const { accessTokenPayload, hasToken, error } = useLoaderData();
    useEffect(() => {
        if (!hasToken && accessTokenPayload === undefined) {
            navigate("/auth");
        }
    }, [hasToken, accessTokenPayload, navigate]);
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
    const callAPIClicked = async () => {
        const userInfoResponse = await fetch("http://localhost:3000/sessioninfo");
        alert(JSON.stringify(await userInfoResponse.json()));
    };
    /**
     * SessionAuthForRemix will handle proper redirection for the user based on the different session states.
     * It will redirect to the login page if the session does not exist etc.
     */
    return (
        <SessionAuthForRemix>
            <div className="main-container">
                <div className="top-band success-title bold-500">
                    <img src="../assets/images/celebrate-icon.svg" alt="Login successful" className="success-icon" />
                    Login successful
                </div>
                <div className="inner-content">
                    <div>Your userID is:</div>
                    <div className="truncate" id="user-id">
                        {accessTokenPayload.sub}
                    </div>
                    <div className="buttons">
                        <button onClick={callAPIClicked} className="dashboard-button">
                            Call API
                        </button>
                        <button onClick={logoutClicked} className="dashboard-button">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </SessionAuthForRemix>
    );
}

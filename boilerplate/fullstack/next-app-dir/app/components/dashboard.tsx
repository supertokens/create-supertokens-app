import { cookies } from "next/headers";
import { TryRefreshComponent } from "./tryRefreshClientComponent";
import { redirect } from "next/navigation";
import { CelebrateIcon } from "../../assets/images";
import Image from "next/image";
import { SessionAuthForNextJS } from "./sessionAuthForNextJS";
import { getSessionForSSR } from "../util";
import DashboardButtons from "./dashboardButtons";

export async function DashboardPage() {
    const cookiesFromReq = await cookies();
    const cookiesArray: Array<{ name: string; value: string }> = Array.from(cookiesFromReq.getAll()).map(
        ({ name, value }) => ({
            name,
            value,
        })
    );
    const { accessTokenPayload, hasToken, error } = await getSessionForSSR(cookiesArray);

    if (error) {
        return <div>Something went wrong while trying to get the session. Error - {error.message}</div>;
    }

    // `accessTokenPayload` will be undefined if it the session does not exist or has expired
    if (accessTokenPayload === undefined) {
        if (!hasToken) {
            /**
             * This means that the user is not logged in. If you want to display some other UI in this
             * case, you can do so here.
             */
            return redirect("/auth");
        }

        /**
         * This means that the session does not exist but we have session tokens for the user. In this case
         * the `TryRefreshComponent` will try to refresh the session.
         *
         * To learn about why the 'key' attribute is required refer to: https://github.com/supertokens/supertokens-node/issues/826#issuecomment-2092144048
         */
        return <TryRefreshComponent key={Date.now()} />;
    }

    /**
     * SessionAuthForNextJS will handle proper redirection for the user based on the different session states.
     * It will redirect to the login page if the session does not exist etc.
     */
    return (
        <SessionAuthForNextJS>
            <div className="main-container">
                <div className="top-band success-title bold-500">
                    <Image src={CelebrateIcon} alt="Login successful" className="success-icon" /> Login successful
                </div>
                <div className="inner-content">
                    <div>Your userID is:</div>
                    <div className="truncate" id="user-id">
                        {accessTokenPayload.sub}
                    </div>
                    <DashboardButtons />
                </div>
            </div>
        </SessionAuthForNextJS>
    );
}

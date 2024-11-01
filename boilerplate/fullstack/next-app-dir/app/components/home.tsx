import { cookies } from "next/headers";
import { TryRefreshComponent } from "./tryRefreshClientComponent";
import styles from "../page.module.css";
import { redirect } from "next/navigation";
import Image from "next/image";
import { CelebrateIcon, SeparatorLine } from "../../assets/images";
import { CallAPIButton } from "./callApiButton";
import { LinksComponent } from "./linksComponent";
import { SessionAuthForNextJS } from "./sessionAuthForNextJS";
import { getSessionForSSR } from "../util";

export async function HomePage() {
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
            <div className={styles.homeContainer}>
                <div className={styles.mainContainer}>
                    <div className={`${styles.topBand} ${styles.successTitle} ${styles.bold500}`}>
                        <Image src={CelebrateIcon} alt="Login successful" className={styles.successIcon} /> Login
                        successful
                    </div>
                    <div className={styles.innerContent}>
                        <div>Your userID is:</div>
                        <div className={`${styles.truncate} ${styles.userId}`}>{accessTokenPayload.sub}</div>
                        <CallAPIButton />
                    </div>
                </div>
                <LinksComponent />
                <Image className={styles.separatorLine} src={SeparatorLine} alt="separator" />
            </div>
        </SessionAuthForNextJS>
    );
}

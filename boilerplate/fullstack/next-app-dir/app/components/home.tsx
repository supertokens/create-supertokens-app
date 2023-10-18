import { getSSRSession } from "../sessionUtils";
import { TryRefreshComponent } from "./tryRefreshClientComponent";
import styles from "../page.module.css";
import { redirect } from "next/navigation";
import Image from "next/image";
import { CelebrateIcon, SeparatorLine } from "../../assets/images";
import { CallAPIButton } from "./callApiButton";
import { LinksComponent } from "./linksComponent";

export async function HomePage() {
    const { session, hasToken } = await getSSRSession();

    if (!session) {
        if (!hasToken) {
            return redirect("/auth");
        }
        return <TryRefreshComponent />;
    }

    return (
        <div className={styles.homeContainer}>
            <div className={styles.mainContainer}>
                <div className={`${styles.topBand} ${styles.successTitle} ${styles.bold500}`}>
                    <Image src={CelebrateIcon} alt="Login successful" className={styles.successIcon} /> Login successful
                </div>
                <div className={styles.innerContent}>
                    <div>Your userID is:</div>
                    <div className={`${styles.truncate} ${styles.userId}`}>{session.getUserId()}</div>
                    <CallAPIButton />
                </div>
            </div>
            <LinksComponent />
            <Image className={styles.separatorLine} src={SeparatorLine} alt="separator" />
        </div>
    );
}

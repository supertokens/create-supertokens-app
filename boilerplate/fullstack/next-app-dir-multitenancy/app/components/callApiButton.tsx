"use client";

import styles from "../page.module.css";

export const CallAPIButton = () => {
    const fetchUserData = async () => {
        const port = process.env.NEXT_PUBLIC_PORT || 3000;
        const userInfoResponse = await fetch(`http://localhost:${port}/api/user`);

        alert(JSON.stringify(await userInfoResponse.json()));
    };

    return (
        <div onClick={fetchUserData} className={styles.sessionButton}>
            Call API
        </div>
    );
};

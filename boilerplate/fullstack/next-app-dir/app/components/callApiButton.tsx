"use client";

import Session, {
  useSessionContext,
} from "supertokens-auth-react/recipe/session";
import styles from "../page.module.css";

export const CallAPIButton = () => {
  const session = useSessionContext();

  if (session.loading) {
    return null;
  }

  const fetchUserData = async () => {
    const accessToken = await Session.getAccessToken();
    const userInfoResponse = await fetch("http://localhost:3001/api/user", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });

    alert(JSON.stringify(await userInfoResponse.json()));
  };

  return (
    <div onClick={fetchUserData} className={styles.sessionButton}>
      Call API
    </div>
  );
};

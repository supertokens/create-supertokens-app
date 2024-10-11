import { useEffect, useState } from "react";
import Session from "supertokens-web-js/recipe/session";

function useSessionInfo() {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<undefined | boolean>(undefined);
    useEffect(() => {
        async function checkSession() {
            try {
                const isSessionValid = await Session.doesSessionExist();
                setIsUserLoggedIn(isSessionValid);
            } catch (error) {
                console.error(error);
            }
        }

        checkSession();
    }, []);
    return {
        sessionExists: isUserLoggedIn,
    };
}

export default useSessionInfo;

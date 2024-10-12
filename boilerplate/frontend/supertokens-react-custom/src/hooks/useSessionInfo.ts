import { useEffect, useState } from "react";
import Session from "supertokens-web-js/recipe/session";

type UserLoggedIn =
    | {
          isLoading: true;
      }
    | {
          isLoading: false;
          isLoggedIn: boolean;
      };

function useSessionInfo() {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<UserLoggedIn>({
        isLoading: true,
    });
    useEffect(() => {
        async function checkSession() {
            try {
                const isSessionValid = await Session.doesSessionExist();
                setIsUserLoggedIn({
                    isLoading: false,
                    isLoggedIn: isSessionValid,
                });
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

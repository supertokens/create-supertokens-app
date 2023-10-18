"use client";

import { useEffect } from "react";
import { useRouter, redirect } from "next/navigation";
import Session from "supertokens-auth-react/recipe/session";
import SuperTokens from "supertokens-auth-react";

export const TryRefreshComponent = () => {
    const router = useRouter();

    useEffect(() => {
        void Session.attemptRefreshingSession()
            .then((hasSession) => {
                if (hasSession) {
                    router.refresh();
                } else {
                    redirect("/auth");
                }
            })
            .catch(console.error);
    }, []);

    return <div>Loading...</div>;
};

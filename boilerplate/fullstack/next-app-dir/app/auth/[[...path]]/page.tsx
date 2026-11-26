"use client";

import { useEffect, useSyncExternalStore } from "react";
import { redirectToAuth } from "supertokens-auth-react";
import SuperTokens from "supertokens-auth-react/ui";
import { PreBuiltUIList } from "../../config/frontend";

const subscribe = () => () => {};

export default function Auth() {
    const loaded = useSyncExternalStore(
        subscribe,
        () => true,
        () => false
    );
    const canHandleRoute = loaded && SuperTokens.canHandleRoute(PreBuiltUIList);

    useEffect(() => {
        if (loaded && !canHandleRoute) {
            redirectToAuth({ redirectBack: false });
        }
    }, [loaded, canHandleRoute]);

    return canHandleRoute ? <>{SuperTokens.getRoutingComponent(PreBuiltUIList)}</> : null;
}

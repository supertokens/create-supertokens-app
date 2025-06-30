import { useEffect, useState } from "react";
import SuperTokensUI, { canHandleRoute } from "supertokens-auth-react/ui/index.js";
import { PreBuiltUIList } from "../config/frontendConfigUtils";
import SuperTokens from "supertokens-auth-react/index.js";

export default function Auth() {
    // If the user visits a page that is not handled by us (like /auth/random), then we redirect them back to the auth page.
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if (canHandleRoute(PreBuiltUIList) === false) {
            SuperTokens.redirectToAuth({ redirectBack: false });
        } else {
            setLoaded(true);
        }
    }, []);

    if (loaded) {
        return SuperTokensUI.getRoutingComponent(PreBuiltUIList);
    }

    return null;
}

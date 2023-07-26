import { Routes } from "react-router-dom";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import { PreBuiltUIList } from "./config";
import { TenantSelector } from "./TenantSelector";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import * as reactRouterDom from "react-router-dom";

export const Auth = () => {
    const tenantId = localStorage.getItem("tenantId");
    const session = useSessionContext();
    const location = reactRouterDom.useLocation();

    if (session.loading) {
        return null;
    }

    if (
        tenantId !== null ||
        session.doesSessionExist === true ||
        new URLSearchParams(location.search).has("tenantId")
    ) {
        return (
            <div className="App app-container">
                <div className="fill">
                    <Routes>
                        {/* This shows the login UI on "/auth" route */}
                        {getSuperTokensRoutesForReactRouterDom(require("react-router-dom"), PreBuiltUIList, "/auth")}
                    </Routes>
                </div>
            </div>
        );
    } else {
        return <TenantSelector />;
    }
};

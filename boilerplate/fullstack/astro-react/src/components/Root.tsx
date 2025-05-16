import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { frontendConfig } from "../config/frontendConfigUtils";
import { SessionAuth } from "supertokens-auth-react/recipe/session/index.js";
import { ComponentWrapper } from "../config/frontend";

SuperTokens.init(frontendConfig());

export default function App({ children }: { children: React.ReactNode }) {
    const isUnprotectedRoute = location.pathname.startsWith("/auth") || location.pathname === "/";

    return (
        <SuperTokensWrapper>
            <ComponentWrapper>{isUnprotectedRoute ? children : <SessionAuth>{children}</SessionAuth>}</ComponentWrapper>
        </SuperTokensWrapper>
    );
}

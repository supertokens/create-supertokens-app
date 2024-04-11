import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { frontendConfig } from "../config/frontend";
import { SessionAuth } from "supertokens-auth-react/recipe/session/index.js";

SuperTokens.init(frontendConfig());

export default function App({ children }: { children: React.ReactNode }) {
    const isUnprotectedRoute = location.pathname.startsWith("/auth");

    return (
        <SuperTokensWrapper>{isUnprotectedRoute ? children : <SessionAuth>{children}</SessionAuth>}</SuperTokensWrapper>
    );
}

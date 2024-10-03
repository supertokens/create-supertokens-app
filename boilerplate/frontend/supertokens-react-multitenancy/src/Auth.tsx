import { AuthRecipeComponentsOverrideContextProvider, AuthPage } from "supertokens-auth-react/ui";
import { PreBuiltUIList } from "./config";
import { TenantSelector } from "./TenantSelector";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { Navigate } from "react-router-dom";
import React from "react";
import { useNavigate } from "react-router-dom";

type ChangeTenantsButtonProps = {
    setShowTenantSelector: React.Dispatch<React.SetStateAction<boolean>>;
};

// We display this component as part of the SuperTokens login form to
// allow users to go back and select another tenant without logging in
const ChangeTenantsButton = ({ setShowTenantSelector }: ChangeTenantsButtonProps) => {
    return (
        <div
            data-supertokens="link tenants-link"
            onClick={() => {
                setShowTenantSelector(true);
            }}
        >
            Log in to a different organisation
        </div>
    );
};

const LoginWithSSOButton = ({
    setShowTenantSelector,
}: {
    setShowTenantSelector: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    return (
        <div
            data-supertokens="link tenants-link"
            onClick={() => {
                localStorage.removeItem("tenantId");
                setShowTenantSelector(true);
            }}
        >
            Log in with Enterprise SSO
        </div>
    );
};

export const Auth = () => {
    const [tenantId, setTenantId] = React.useState(localStorage.getItem("tenantId"));
    const session = useSessionContext();
    const [showTenantSelector, setShowTenantSelector] = React.useState(false);
    const navigate = useNavigate();

    if (session.loading) {
        return null;
    }

    if (session.doesSessionExist) {
        return <Navigate to="/" />;
    }

    if (showTenantSelector) {
        return <TenantSelector setTenantId={setTenantId} setShowTenantSelector={setShowTenantSelector} />;
    }

    return (
        <AuthRecipeComponentsOverrideContextProvider
            components={{
                AuthPageFooter_Override: ({ DefaultComponent, ...props }) => {
                    if (tenantId === null || tenantId === "public") {
                        return (
                            <div>
                                <DefaultComponent {...props} />
                                <LoginWithSSOButton setShowTenantSelector={setShowTenantSelector} />
                                <div
                                    style={{
                                        marginTop: "5px",
                                        fontSize: "12px",
                                        color: "#666",
                                    }}
                                >
                                    Selected tenant: {tenantId}
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div>
                                <DefaultComponent {...props} />
                                <ChangeTenantsButton setShowTenantSelector={setShowTenantSelector} />
                                <div
                                    style={{
                                        marginTop: "5px",
                                        fontSize: "12px",
                                        color: "#666",
                                    }}
                                >
                                    Selected tenant: {tenantId}
                                </div>
                            </div>
                        );
                    }
                },
            }}
        >
            <div className="App app-container" key={tenantId}>
                <div className="fill">
                    <AuthPage preBuiltUIList={PreBuiltUIList} navigate={navigate} />
                </div>
            </div>
        </AuthRecipeComponentsOverrideContextProvider>
    );
};

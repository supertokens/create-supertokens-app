"use client";

import React, { useEffect } from "react";
import { redirectToAuth } from "supertokens-auth-react";
import SuperTokens, { AuthRecipeComponentsOverrideContextProvider, AuthPage } from "supertokens-auth-react/ui";
import { PreBuiltUIList } from "../../config/frontend";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { TenantSelector } from "../../../app/components/TenantSelector";
import { redirect, usePathname } from "next/navigation";

export default function Auth() {
    const session = useSessionContext();
    const pathname = usePathname();

    // if the user visits a page that is not handled by us (like /auth/random), then we redirect them back to the auth page.
    useEffect(() => {
        if (SuperTokens.canHandleRoute(PreBuiltUIList) === false) {
            redirectToAuth({ redirectBack: false });
        }
    }, []);

    if (session.loading === true) {
        return null;
    }

    // if current path is /auth
    if (pathname === "/auth") {
        return <AuthComponentWithTenantSelector />;
    }
    return SuperTokens.getRoutingComponent(PreBuiltUIList);
}

type ChangeTenantsButtonProps = {
    setShowTenantSelector: React.Dispatch<React.SetStateAction<boolean>>;
};

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

function AuthComponentWithTenantSelector() {
    const [tenantId, setTenantId] = React.useState(localStorage.getItem("tenantId"));
    const session = useSessionContext();
    const [showTenantSelector, setShowTenantSelector] = React.useState(false);

    if (session.loading) {
        return null;
    }

    if (session.doesSessionExist) {
        return redirect("/");
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
                    <AuthPage preBuiltUIList={PreBuiltUIList} />
                </div>
            </div>
        </AuthRecipeComponentsOverrideContextProvider>
    );
}

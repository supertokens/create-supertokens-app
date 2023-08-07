import { Routes } from "react-router-dom";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import { PreBuiltUIList } from "./config";
import { TenantSelector } from "./TenantSelector";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import * as reactRouterDom from "react-router-dom";
import React from "react";
import { ThirdpartyEmailPasswordComponentsOverrideProvider } from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { ThirdpartyPasswordlessComponentsOverrideProvider } from "supertokens-auth-react/recipe/thirdpartypasswordless";

type ChangeTenantsButtonProps = {
    setHasSelectedTenantId: React.Dispatch<React.SetStateAction<boolean>>;
};

// We display this component as part of the SuperTokens login form to
// allow users to go back and select another tenant without logging in
const ChangeTenantsButton = ({ setHasSelectedTenantId }: ChangeTenantsButtonProps) => {
    return (
        <div
            data-supertokens="link tenants-link"
            onClick={() => {
                localStorage.removeItem("tenantId");
                setHasSelectedTenantId(false);
            }}
        >
            Log in to a different organisation
        </div>
    );
};

export const Auth = () => {
    const tenantId = localStorage.getItem("tenantId");
    const session = useSessionContext();
    const [hasSelectedTenantId, setHasSelectedTenantId] = React.useState(false);
    const location = reactRouterDom.useLocation();

    if (session.loading) {
        return null;
    }

    if (
        hasSelectedTenantId ||
        tenantId !== null ||
        session.doesSessionExist === true ||
        new URLSearchParams(location.search).has("tenantId")
    ) {
        return (
            <ThirdpartyEmailPasswordComponentsOverrideProvider
                components={{
                    EmailPasswordSignInFooter_Override: ({ DefaultComponent, ...props }) => {
                        return (
                            <div>
                                <DefaultComponent {...props} />
                                <ChangeTenantsButton setHasSelectedTenantId={setHasSelectedTenantId} />
                            </div>
                        );
                    },
                }}
            >
                <ThirdpartyPasswordlessComponentsOverrideProvider
                    components={{
                        PasswordlessSignInUpFooter_Override: ({ DefaultComponent, ...props }) => {
                            return (
                                <div>
                                    <DefaultComponent {...props} />
                                    <ChangeTenantsButton setHasSelectedTenantId={setHasSelectedTenantId} />
                                </div>
                            );
                        },
                    }}
                >
                    <div className="App app-container">
                        <div className="fill">
                            <Routes>
                                {/* This shows the login UI on "/auth" route */}
                                {getSuperTokensRoutesForReactRouterDom(
                                    require("react-router-dom"),
                                    PreBuiltUIList,
                                    "/auth"
                                )}
                            </Routes>
                        </div>
                    </div>
                </ThirdpartyPasswordlessComponentsOverrideProvider>
            </ThirdpartyEmailPasswordComponentsOverrideProvider>
        );
    } else {
        return <TenantSelector setHasSelectedTenantId={setHasSelectedTenantId} />;
    }
};

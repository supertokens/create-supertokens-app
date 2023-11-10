"use client";

import React, { useEffect } from "react";
import { redirectToAuth } from "supertokens-auth-react";
import SuperTokens from "supertokens-auth-react/ui";
import { PreBuiltUIList } from "../../config/frontend";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { ThirdpartyEmailPasswordComponentsOverrideProvider } from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { ThirdpartyPasswordlessComponentsOverrideProvider } from "supertokens-auth-react/recipe/thirdpartypasswordless";
import { ChangeTenantsButton } from "../../../app/components/changeTenantsButton";
import { TenantSelector } from "../../../app/components/TenantSelector";

export default function Auth() {
    const session = useSessionContext();
    const [hasSelectedTenantId, setHasSelectedTenantId] = React.useState(false);

    // if the user visits a page that is not handled by us (like /auth/random), then we redirect them back to the auth page.
    useEffect(() => {
        if (SuperTokens.canHandleRoute(PreBuiltUIList) === false) {
            redirectToAuth({ redirectBack: false });
        }
    }, []);

    if (session.loading === true) {
        return null;
    }

    const SuperTokensComponent = SuperTokens.getRoutingComponent(PreBuiltUIList);
    const tenantId = localStorage.getItem("tenantId");

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
                    {SuperTokensComponent}
                </ThirdpartyPasswordlessComponentsOverrideProvider>
            </ThirdpartyEmailPasswordComponentsOverrideProvider>
        );
    } else {
        return <TenantSelector setHasSelectedTenantId={setHasSelectedTenantId} />;
    }
}

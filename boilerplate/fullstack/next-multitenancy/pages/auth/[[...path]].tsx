import Head from "next/head";
import React, { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import dynamic from "next/dynamic";
import SuperTokens from "supertokens-auth-react";
import { canHandleRoute, getRoutingComponent } from "supertokens-auth-react/ui";
import { PreBuiltUIList } from "../../config/frontendConfig";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { TenantSelector } from "../../src/components/TenantSelector";
import { ThirdpartyEmailPasswordComponentsOverrideProvider } from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { ThirdpartyPasswordlessComponentsOverrideProvider } from "supertokens-auth-react/recipe/thirdpartypasswordless";

const SuperTokensComponentNoSSR = dynamic<{}>(new Promise((res) => res(() => getRoutingComponent(PreBuiltUIList))), {
    ssr: false,
});

// We display this component as part of the SuperTokens login form to
// allow users to go back and select another tenant without logging in
const ChangeTenantsButton = (props: { setHasSelectedTenantId: React.Dispatch<React.SetStateAction<boolean>> }) => {
    return (
        <div
            data-supertokens="link tenants-link"
            onClick={() => {
                localStorage.removeItem("tenantId");
                props.setHasSelectedTenantId(false);
            }}
        >
            Log in to a different organisation
        </div>
    );
};

export default function Auth(): JSX.Element {
    if (typeof window === "undefined") {
        return <></>;
    }

    const tenantId = localStorage.getItem("tenantId");
    const session = useSessionContext();
    const [hasSelectedTenantId, setHasSelectedTenantId] = React.useState(false);

    useEffect(() => {
        if (canHandleRoute(PreBuiltUIList) === false) {
            SuperTokens.redirectToAuth({
                redirectBack: false,
            });
        }
    }, []);

    if (session.loading === true) {
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
                    <div className={styles.container}>
                        <Head>
                            <title>SuperTokens 💫</title>
                            <link
                                href="//fonts.googleapis.com/css2?family=Rubik:wght@400&display=swap"
                                rel="stylesheet"
                                type="text/css"
                            />
                            <link rel="icon" href="/favicon.ico" />
                        </Head>

                        <main className={styles.main}>
                            <SuperTokensComponentNoSSR />
                        </main>
                    </div>
                </ThirdpartyPasswordlessComponentsOverrideProvider>
            </ThirdpartyEmailPasswordComponentsOverrideProvider>
        );
    } else {
        return <TenantSelector setHasSelectedTenantId={setHasSelectedTenantId} />;
    }
}

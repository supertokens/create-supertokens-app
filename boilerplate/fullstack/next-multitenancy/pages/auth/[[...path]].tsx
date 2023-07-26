import Head from "next/head";
import React, { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import dynamic from "next/dynamic";
import SuperTokens from "supertokens-auth-react";
import { canHandleRoute, getRoutingComponent } from "supertokens-auth-react/ui";
import { PreBuiltUIList } from "../../config/frontendConfig";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { TenantSelector } from "../../src/components/TenantSelector";

const SuperTokensComponentNoSSR = dynamic<{}>(new Promise((res) => res(() => getRoutingComponent(PreBuiltUIList))), {
    ssr: false,
});

export default function Auth(): JSX.Element {
    if (typeof window === "undefined") {
        return <></>;
    }

    const tenantId = localStorage.getItem("tenantId");
    const session = useSessionContext();

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
        tenantId !== null ||
        session.doesSessionExist === true ||
        new URLSearchParams(location.search).has("tenantId")
    ) {
        return (
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
        );
    } else {
        return <TenantSelector />;
    }
}

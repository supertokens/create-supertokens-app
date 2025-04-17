"use client";
import React from "react";
import { SuperTokensWrapper } from "supertokens-auth-react";
import SuperTokensReact from "supertokens-auth-react";
import { SuperTokensConfig } from "../config/frontend"; // <-- Import correct name
import { usePathname, useRouter } from "next/navigation";

// Define setRouter locally
export function setRouter(router: any, pathname: string) {
    if (typeof window !== "undefined" && SuperTokensReact.isInitialized()) {
        SuperTokensReact.getInstanceOrThrow().appInfo = {
            ...SuperTokensReact.getInstanceOrThrow().appInfo,
            websiteBasePath: router.basePath ? router.basePath + pathname : pathname,
        };
        SuperTokensReact.getInstanceOrThrow().navigation = {
            push: (path: string) => router.push(path),
            replace: (path: string) => router.replace(path),
            back: () => router.back(),
            get: () => ({ pathname }),
        };
    }
}

if (typeof window !== "undefined") {
    // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'
    SuperTokensReact.init(SuperTokensConfig); // <-- Use correct config object
}

export const SuperTokensProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    // Removed setRouter call

    return <SuperTokensWrapper>{children}</SuperTokensWrapper>;
};

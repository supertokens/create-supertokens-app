"use client";

import { useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";

type Props = Parameters<typeof SessionAuth>[0] & {
    children?: ReactNode | undefined;
};

const subscribe = () => () => {};

export const SessionAuthForNextJS = (props: Props) => {
    const loaded = useSyncExternalStore(
        subscribe,
        () => true,
        () => false
    );
    if (!loaded) {
        return props.children;
    }
    return <SessionAuth {...props}>{props.children}</SessionAuth>;
};

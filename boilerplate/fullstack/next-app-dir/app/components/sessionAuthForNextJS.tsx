"use client";

import React, { useState, useEffect } from "react";
import { SessionAuth, useSessionContext } from "supertokens-auth-react/recipe/session";

type Props = Parameters<typeof SessionAuth>[0] & {
    children?: React.ReactNode | undefined;
    ssrSessionExists?: boolean;
};

export const SessionAuthForNextJS = (props: Props) => {
    const session = useSessionContext();

    if (props.ssrSessionExists && session.loading) {
        return props.children;
    }

    return <SessionAuth {...props}>{props.children}</SessionAuth>;
};

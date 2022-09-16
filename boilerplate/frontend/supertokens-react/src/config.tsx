// This is temporary file, if you see this comment in this file report this as an issue for create-supertokens-app

import React from "react";

export const SuperTokensConfig = {
    appInfo: {
        appName: "",
        apiDomain: "",
        websiteDomain: "",
    },
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [],
};

export const AuthWrapper: React.FC<any> = (props: any) => {
    return <div>{props.children}</div>;
};

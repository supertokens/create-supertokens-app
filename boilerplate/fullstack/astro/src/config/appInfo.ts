export const getDomain = () => {
    const port = import.meta.env.PUBLIC_PORT || 5167;
    return `http://localhost:${port}`;
};

export const appInfo = {
    // learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo
    appName: "SuperTokens Astro demo app",
    apiDomain: getDomain(),
    websiteDomain: getDomain(),
    apiBasePath: "/api/auth",
    websiteBasePath: "/auth",
};

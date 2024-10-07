const port = import.meta.env.VITE_PORT || 3000;

export const appInfo = {
    // learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo
    appName: "SuperTokens Remix demo app",
    apiDomain: `http://localhost:${port}`,
    websiteDomain: `http://localhost:${port}`,
    apiBasePath: "/supertokens",
    websiteBasePath: "/auth",
};

const appInfo = {
    appName: "SuperTokens Demo App",
    apiDomain: "http://localhost:3001",
    websiteDomain: "http://localhost:3000",
    defaultApiPort: 3001,
    defaultWebsitePort: 3000,
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
};

const fullstackAppInfo = {
    appName: "SuperTokens Demo App",
    apiDomain: "http://localhost:3000",
    websiteDomain: "http://localhost:3000",
    defaultApiPort: 3000,
    defaultWebsitePort: 3000,
    apiBasePath: "/api/auth/",
    websiteBasePath: "/auth",
};

export const getAppInfo = (isFullStack = false) => {
    if (isFullStack) {
        return fullstackAppInfo;
    }
    return appInfo;
};

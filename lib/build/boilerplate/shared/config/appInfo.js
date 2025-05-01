const DEFAULT_API_PORT = 3001;
const DEFAULT_API_HOST = "localhost";
const DEFAULT_WEBSITE_PORT = 3000;
const DEFAULT_WEBSITE_HOST = "localhost";
const DEFAULT_FULLSTACK_PORT = 3000;
const DEFAULT_FULLSTACK_HOST = "localhost";
const DEFAULT_API_BASE_PATH = "/auth";
const DEFAULT_WEBSITE_BASE_PATH = "/auth";
const DEFAULT_FULLSTACK_API_BASE_PATH = "/api/auth/";
const DEFAULT_FULLSTACK_WEBSITE_BASE_PATH = "/auth";
const DEFAULT_APP_NAME = "SuperTokens Demo App";
const DEFAULT_CONNECTION_URI = "https://try.supertokens.com";
const DEFAULT_REDIRECTION_URL = "/dashboard";
export const getAppConfig = (isFullStack = false, config) => {
    const apiPort = config.apiport ?? (isFullStack ? DEFAULT_FULLSTACK_PORT : DEFAULT_API_PORT);
    const apiHost = config.apihost ?? (isFullStack ? DEFAULT_FULLSTACK_HOST : DEFAULT_API_HOST);
    const apiProtocol = apiHost.toLowerCase().startsWith("localhost") ? "http" : "https";
    const apiDomain = `${apiProtocol}://${apiHost}:${apiPort}`;
    const websitePort = config.clientport ?? (isFullStack ? DEFAULT_FULLSTACK_PORT : DEFAULT_WEBSITE_PORT);
    const websiteHost = config.clienthost ?? (isFullStack ? DEFAULT_FULLSTACK_HOST : DEFAULT_WEBSITE_HOST);
    const websiteProtocol = websiteHost.toLowerCase().startsWith("localhost") ? "http" : "https";
    const websiteDomain = `${websiteProtocol}://${websiteHost}:${websitePort}`;
    if (isFullStack) {
        if (websiteDomain !== apiDomain) {
            throw new Error("apihost and clienthost or apiport and clientport must be the same for fullstack");
        }
    }
    const appName = config.appname ?? DEFAULT_APP_NAME;
    const apiBasePath = config.apibasepath ?? (isFullStack ? DEFAULT_FULLSTACK_API_BASE_PATH : DEFAULT_API_BASE_PATH);
    const websiteBasePath =
        config.websitebasepath ?? (isFullStack ? DEFAULT_FULLSTACK_WEBSITE_BASE_PATH : DEFAULT_WEBSITE_BASE_PATH);
    const connectionURI = config.coreuri ?? DEFAULT_CONNECTION_URI;
    const redirectionURL = config.redirectionurl ?? DEFAULT_REDIRECTION_URL;
    const appInfo = {
        appName,
        apiDomain,
        defaultApiPort: apiPort,
        defaultApiHost: apiHost,
        websiteDomain,
        defaultWebsitePort: websitePort,
        defaultWebsiteHost: websiteHost,
        apiBasePath,
        websiteBasePath,
    };
    const supertokens = {
        connectionURI,
        redirectionURL,
    };
    return { appInfo, supertokens: supertokens };
};

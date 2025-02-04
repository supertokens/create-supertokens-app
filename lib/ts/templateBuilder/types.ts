// types/config.ts
export type ConfigType =
    | "all_auth"
    | "emailpassword"
    | "multifactorauth"
    | "multitenancy"
    | "passwordless"
    | "thirdpartyemailpassword"
    | "thirdpartypasswordless";

export type IndividualRecipe =
    | "emailPassword"
    | "thirdParty"
    | "passwordless"
    | "session"
    | "dashboard"
    | "userRoles"
    | "multiFactorAuth"
    | "accountLinking"
    | "emailVerification"
    | "totp";

export type Language = "ts" | "py" | "go";

export type AppInfo = {
    appName: string;
    apiDomain: string;
    websiteDomain: string;
    apiBasePath: string;
    websiteBasePath: string;
    connectionURI: string;
};

export type OAuthProvider = {
    id: string;
    clientId: string;
    clientSecret: string;
    additionalConfig?: Record<string, any>;
};

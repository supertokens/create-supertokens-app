// types/config.ts
export type ConfigType =
    | "all_auth"
    | "emailpassword"
    | "multifactorauth"
    | "multitenancy"
    | "passwordless"
    | "thirdparty"
    | "thirdpartyemailpassword"
    | "thirdpartypasswordless"
    | "webauthn";

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
    | "totp"
    | "multitenancy"
    | "webauthn";

export type FrontendFramework = "react" | "vue" | "angular" | "solid";

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

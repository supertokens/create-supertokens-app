import { type IndividualRecipe, type ConfigType } from "./types.js"; // Added .js

export const configToRecipes: Record<ConfigType, IndividualRecipe[]> = {
    all_auth: ["emailPassword", "thirdParty", "passwordless", "session", "dashboard", "userRoles"],
    emailpassword: ["emailPassword", "session", "dashboard", "userRoles"],
    multifactorauth: [
        "emailPassword",
        "thirdParty",
        "passwordless",
        "session",
        "multiFactorAuth",
        "emailVerification",
        "totp",
        "accountLinking",
        "dashboard",
        "userRoles",
    ],
    thirdparty: ["thirdParty", "session", "dashboard", "userRoles"],
    multitenancy: [
        "emailPassword",
        "thirdParty",
        "passwordless",
        "session",
        "dashboard",
        "userRoles",
        "multitenancy",
        "multiFactorAuth",
        "accountLinking",
        "emailVerification",
    ],
    passwordless: ["passwordless", "session", "dashboard", "userRoles"],
    thirdpartyemailpassword: ["emailPassword", "thirdParty", "session", "dashboard", "userRoles"],
    thirdpartypasswordless: ["thirdParty", "passwordless", "session", "dashboard", "userRoles"],
};

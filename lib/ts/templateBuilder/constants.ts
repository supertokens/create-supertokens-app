import { type IndividualRecipe, type ConfigType } from "./types";

export const configToRecipes: Record<ConfigType, IndividualRecipe[]> = {
    all_auth: ["emailPassword", "thirdParty", "passwordless", "session", "dashboard", "userRoles"],
    emailpassword: ["emailPassword", "session", "dashboard", "userRoles"],
    multifactorauth: [
        "emailPassword",
        "thirdParty",
        "passwordless",
        "multiFactorAuth",
        "accountLinking",
        "emailVerification",
        "totp",
    ],
    multitenancy: ["thirdParty", "emailPassword", "passwordless", "session", "dashboard", "userRoles"],
    passwordless: ["passwordless", "session", "dashboard", "userRoles"],
    thirdpartyemailpassword: ["emailPassword", "thirdParty", "session", "dashboard", "userRoles"],
    thirdpartypasswordless: ["thirdParty", "passwordless", "session", "dashboard", "userRoles"],
};

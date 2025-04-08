export const configToRecipes = {
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
    // Include MFA-related recipes when Multitenancy is selected
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
        "emailVerification", // Added
    ],
    passwordless: ["passwordless", "session", "dashboard", "userRoles"],
    thirdpartyemailpassword: ["emailPassword", "thirdParty", "session", "dashboard", "userRoles"],
    thirdpartypasswordless: ["thirdParty", "passwordless", "session", "dashboard", "userRoles"],
};

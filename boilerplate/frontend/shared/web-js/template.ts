import { type ConfigType } from "../../../../lib/ts/templateBuilder/types";
import { configToRecipes } from "../../../../lib/ts/templateBuilder/constants";
import { getAppInfo } from "../../../shared/config/appInfo";
import { UserFlags } from "../../../../lib/ts/types";

interface WebJSTemplate {
    configType: ConfigType;
    userArguments?: UserFlags;
    isFullStack?: boolean;
    // Removed unused _framework parameter
}

// Only include recipes that have frontend components
export const frontendRecipes = [
    "emailPassword",
    "thirdParty",
    "passwordless",
    "session",
    "multiFactorAuth",
    "emailVerification",
    "totp",
    "multitenancy",
] as const;

export const webJsRecipeImports = {
    emailPassword: `import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";`,
    thirdParty: `import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";`,
    passwordless: `import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";`,
    session: `import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";`,
    multiFactorAuth: `import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";
import EmailVerification from "supertokens-web-js/recipe/emailverification";
import MultiFactorAuth from "supertokens-web-js/recipe/multifactorauth";`,
    emailVerification: `import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";
import EmailVerification from "supertokens-web-js/recipe/emailverification";`,
    totp: `import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";
import TOTP from "supertokens-web-js/recipe/totp";`,
    multitenancy: `import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";
import Multitenancy from "supertokens-web-js/recipe/multitenancy";`,
} as const;

export const webJsRecipeInits = {
    emailPassword: () => `Session.init()`,
    thirdParty: () => `Session.init()`,
    passwordless: () => `Session.init()`,
    session: () => `Session.init()`,
    multiFactorAuth: () => `Session.init(), EmailVerification.init(), MultiFactorAuth.init()`,
    emailVerification: () => `Session.init(), EmailVerification.init()`,
    totp: () => `Session.init(), TOTP.init()`,
    multitenancy: () => `Session.init(), Multitenancy.init({
    override: {
        functions: (oI) => {
            return {
                ...oI,
                getTenantId: async () => {
                    const tenantIdInStorage = localStorage.getItem("tenantId");
                    return tenantIdInStorage === null ? undefined : tenantIdInStorage;
                },
            };
        },
    },
})`,
} as const;

export const uiRecipeInits = {
    emailPassword: () => `(window as any).supertokensUIEmailPassword.init()`,
    thirdParty: () => `(window as any).supertokensUIThirdParty.init({
                signInAndUpFeature: {
                    providers: [
                        (window as any).supertokensUIThirdParty.Github.init(),
                        (window as any).supertokensUIThirdParty.Google.init(),
                        (window as any).supertokensUIThirdParty.Apple.init(),
                        (window as any).supertokensUIThirdParty.Twitter.init(),
                    ],
                },
            })`,
    passwordless: (userArguments?: UserFlags) => {
        // Determine contact method based on user arguments
        let contactMethod = "EMAIL";
        let flowType; // To handle OTP and magic link combined flows

        const hasLinkEmail =
            userArguments?.firstfactors?.includes("link-email") || userArguments?.secondfactors?.includes("link-email");
        const hasLinkPhone =
            userArguments?.firstfactors?.includes("link-phone") || userArguments?.secondfactors?.includes("link-phone");
        const hasOtpEmail =
            userArguments?.firstfactors?.includes("otp-email") || userArguments?.secondfactors?.includes("otp-email");
        const hasOtpPhone =
            userArguments?.firstfactors?.includes("otp-phone") || userArguments?.secondfactors?.includes("otp-phone");

        // Determine contact method based on factors
        // Note: The documentation in web-js.mdc incorrectly states "EMAIL_OR_PASSWORD" but it should be "EMAIL_OR_PHONE"
        if ((hasLinkEmail || hasOtpEmail) && (hasLinkPhone || hasOtpPhone)) {
            contactMethod = "EMAIL_OR_PHONE";
        } else if (hasLinkPhone || hasOtpPhone) {
            contactMethod = "PHONE";
        } else {
            contactMethod = "EMAIL";
        }

        // Check if we need both OTP and magic link flow
        // Determine flow type based on factors
        // Note: The documentation states that if both otp_email and otp_phone are present,
        // the flowType becomes "USER_INPUT_CODE_AND_MAGIC_LINK"
        if ((hasOtpEmail || hasOtpPhone) && (hasLinkEmail || hasLinkPhone)) {
            flowType = "USER_INPUT_CODE_AND_MAGIC_LINK";
        } else if (hasLinkEmail || hasLinkPhone) {
            flowType = "MAGIC_LINK";
        } else if (hasOtpEmail || hasOtpPhone) {
            flowType = "USER_INPUT_CODE";
        }

        const initObj = [`contactMethod: "${contactMethod}"`];
        if (flowType) {
            initObj.push(`flowType: "${flowType}"`);
        }

        return `(window as any).supertokensUIPasswordless.init({
                ${initObj.join(",\n                ")}
            })`;
    },
    session: () => `(window as any).supertokensUISession.init()`,
    multiFactorAuth: (firstFactors?: string[], secondFactors?: string[]) => {
        // For the UI init, we use a simplified first factors setting
        const firstFactorsStr = firstFactors
            ? firstFactors.map((f) => `"${f}"`).join(", ")
            : `"thirdparty", "emailpassword"`;

        // If we have second factors, we need to include the override function
        if (secondFactors && secondFactors.length > 0) {
            // Map the second factors to the correct FactorIds
            const factorMapping: Record<string, string> = {
                totp: "(window as any).supertokensUIMultiFactorAuth.FactorIds.TOTP",
                "otp-email": "(window as any).supertokensUIMultiFactorAuth.FactorIds.OTP_EMAIL",
                "otp-phone": "(window as any).supertokensUIMultiFactorAuth.FactorIds.OTP_PHONE",
                "link-email": "(window as any).supertokensUIMultiFactorAuth.FactorIds.LINK_EMAIL",
                "link-phone": "(window as any).supertokensUIMultiFactorAuth.FactorIds.LINK_PHONE",
            };

            const factorIds = secondFactors.map((factor) => factorMapping[factor] || `"${factor}"`).filter(Boolean);

            if (factorIds.length > 0) {
                return `(window as any).supertokensUIMultiFactorAuth.init({
        firstFactors: [${firstFactorsStr}],
        override: {
            functions: (originalImplementation: any) => ({
                ...originalImplementation,
                getMFARequirementsForAuth: () => [
                    {
                        oneOf: [
                            ${factorIds.join(",\n                            ")}
                        ],
                    },
                ],
                // Override the getRequiredSecondaryFactorsForUser function to ensure
                // the user is required to set up the second factors
                getRequiredSecondaryFactorsForUser: async () => {
                    return [${factorIds.join(", ")}];
                },
            }),
        }
    })`;
            }
        }

        // Simple initialization for MFA if no second factors are specified
        return `(window as any).supertokensUIMultiFactorAuth.init({
        firstFactors: [${firstFactorsStr}]
    })`;
    },
    // Set mode based on MFA status
    emailVerification: (hasMFA?: boolean) => `(window as any).supertokensUIEmailVerification.init({
        mode: ${hasMFA ? '"OPTIONAL"' : '"REQUIRED"'}
    })`,
    totp: () => `(window as any).supertokensUITOTP.init()`,
    multitenancy: () => `(window as any).supertokensUIMultitenancy.init({
        override: {
            functions: (oI) => {
                return {
                    ...oI,
                    getTenantId: async () => {
                        const tenantIdInStorage = localStorage.getItem("tenantId");
                        return tenantIdInStorage === null ? undefined : tenantIdInStorage;
                    },
                };
            },
        },
    })`,
} as const;

export function getEnvPrefix(framework: string): string {
    if (framework === "angular") {
        return "NG_APP_";
    }
    return "VITE_APP_";
}

// Removed incorrect import for frontendRecipes, it's defined locally above

export const generateWebJSTemplate = ({ configType, isFullStack, userArguments }: WebJSTemplate): string => {
    // Determine recipes based on userArguments first, then fall back to configType if no factors provided
    const recipesSet = new Set<string>(["session"]); // Start with session

    if (userArguments?.firstfactors || userArguments?.secondfactors) {
        const factors = [...(userArguments.firstfactors || []), ...(userArguments.secondfactors || [])];
        if (factors.includes("emailpassword")) recipesSet.add("emailPassword");
        if (factors.includes("thirdparty")) recipesSet.add("thirdParty");
        if (factors.some((f) => f.startsWith("otp-") || f.startsWith("link-"))) recipesSet.add("passwordless");
        if (userArguments.secondfactors && userArguments.secondfactors.length > 0) recipesSet.add("multiFactorAuth");
        if (userArguments.secondfactors?.includes("totp")) recipesSet.add("totp");
        if (userArguments.secondfactors?.some((f) => f.includes("email"))) recipesSet.add("emailVerification");
        // Add multitenancy if configType is multitenancy (factors don't determine this)
        if (configType === "multitenancy") recipesSet.add("multitenancy");
    } else {
        // Fallback to configType if no factors provided
        configToRecipes[configType]?.forEach((recipe) => recipesSet.add(recipe)); // Add null check for safety
    }

    // Filter for recipes that actually have frontend components
    const recipes = [...recipesSet].filter((recipe) =>
        frontendRecipes.includes(recipe as typeof frontendRecipes[number])
    );

    // Check if MFA is needed (based on second factors OR if multifactorauth recipe is present in the final list)
    const hasMFA =
        (userArguments?.secondfactors && userArguments.secondfactors.length > 0) || recipes.includes("multiFactorAuth");

    // If MFA is needed but not included, add it
    if (hasMFA && !recipes.includes("multiFactorAuth")) {
        recipes.push("multiFactorAuth");
    }

    // Add TOTP if it's used as a second factor
    const needsTOTP = hasMFA && userArguments?.secondfactors?.includes("totp") && !recipes.includes("totp");

    if (needsTOTP) {
        recipes.push("totp");
    }

    // Add email verification if needed for email-based second factors
    const needsEmailVerification =
        hasMFA &&
        userArguments?.secondfactors?.some((factor) => factor.includes("email")) &&
        !recipes.includes("emailVerification");

    if (needsEmailVerification) {
        recipes.push("emailVerification");
    }

    const appInfo = getAppInfo(isFullStack);

    // Keep imports simple - just the basic ones needed
    let imports = `import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";`;

    // If MFA is needed, add the necessary imports
    if (hasMFA) {
        imports = `import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";
import EmailVerification from "supertokens-web-js/recipe/emailverification";
import MultiFactorAuth from "supertokens-web-js/recipe/multifactorauth";`;
    }

    // For the web-js initialization function
    let initSuperTokensWebJSCode = `SuperTokens.init({
        appInfo: {
            appName: "${appInfo.appName}",
            apiDomain: getApiDomain(),
            // websiteDomain is not needed for core SDK init
            apiBasePath: "${appInfo.apiBasePath}",
            // websiteBasePath is not needed for core SDK init
        },
        recipeList: [Session.init()]
    });`;

    // If MFA is needed, update the webJS initialization to include core MFA recipes
    if (hasMFA) {
        initSuperTokensWebJSCode = `SuperTokens.init({
        appInfo: {
            appName: "${appInfo.appName}",
            apiDomain: getApiDomain(),
            // websiteDomain is not needed for core SDK init
            apiBasePath: "${appInfo.apiBasePath}",
            // websiteBasePath is not needed for core SDK init
        },
        // Core SDK init only needs Session, EmailVerification, and MultiFactorAuth for MFA
        recipeList: [Session.init(), EmailVerification.init(), MultiFactorAuth.init()]
    });`;
    }
    // Otherwise, the default initSuperTokensWebJSCode (with only Session.init()) is used

    // Define helper functions to be included in the generated config
    const getApiDomainFunc = `
export function getApiDomain() {
    const apiPort = ${appInfo.defaultApiPort};
    const apiUrl = \`http://localhost:\${apiPort}\`;
    return apiUrl;
}`;
    const getWebsiteDomainFunc = `
export function getWebsiteDomain() {
    const websitePort = ${appInfo.defaultWebsitePort};
    const websiteUrl = \`http://localhost:\${websitePort}\`;
    return websiteUrl;
}`;

    // For the UI initialization function
    // Initialize recipes for the UI
    const uiInitStrings = recipes
        .map((recipe) => {
            if (recipe === "multiFactorAuth") {
                return uiRecipeInits.multiFactorAuth(userArguments?.firstfactors, userArguments?.secondfactors);
            }
            if (recipe === "passwordless") {
                return uiRecipeInits.passwordless(userArguments);
            }
            // Handle EmailVerification separately to pass hasMFA
            if (recipe === "emailVerification") {
                return uiRecipeInits.emailVerification(hasMFA ?? false);
            }
            // For other recipes without specific args in UI init
            const initFunc = uiRecipeInits[recipe as keyof typeof uiRecipeInits];
            if (typeof initFunc === "function") {
                // Need to check if function expects args, currently only passwordless/mfa/ev do
                if (recipe !== "passwordless" && recipe !== "multiFactorAuth") {
                    return (initFunc as any)();
                }
            }
            // Return null or handle error if initFunc is not callable or needs args we didn't provide
            console.warn(`Skipping UI init for recipe (or init func not found/callable): ${recipe}`);
            return null;
        })
        .filter(Boolean);

    // Add additional required UI inits (ensure EV isn't added twice)
    if (hasMFA) {
        // EV is now handled in the map above, so this check is likely redundant
        // if (!uiInitStrings.some((init) => init.includes("EmailVerification"))) {
        //     uiInitStrings.push(uiRecipeInits.emailVerification(hasMFA ?? false));
        // }
        if (needsTOTP && !uiInitStrings.some((init) => init.includes("TOTP"))) {
            uiInitStrings.push(uiRecipeInits.totp());
        }
    }

    const isMultitenancy = configType === "multitenancy";
    if (isMultitenancy && !uiInitStrings.some((init) => init.includes("Multitenancy"))) {
        uiInitStrings.push(uiRecipeInits.multitenancy());
    }

    // Generate template following the structure in final-shape-tables.mdc
    // Prepend helper functions
    return `${imports}
${getApiDomainFunc}
${getWebsiteDomainFunc}

export function initSuperTokensUI() {
    (window as any).supertokensUIInit("supertokensui", {
        appInfo: {
            // Call generated helper functions and include base paths
            websiteDomain: getWebsiteDomain(),
            apiDomain: getApiDomain(),
            appName: "${appInfo.appName}",
            websiteBasePath: "${appInfo.websiteBasePath}", // Add websiteBasePath
            apiBasePath: "${appInfo.apiBasePath}", // Add apiBasePath
        },
        recipeList: [
            ${uiInitStrings.join(",\n            ")}
        ],
    });
}

export function initSuperTokensWebJS() {
    ${initSuperTokensWebJSCode}
}`;
};

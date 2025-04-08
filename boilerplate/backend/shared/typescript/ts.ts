import { type OAuthProvider, type ConfigType } from "../../../../lib/ts/templateBuilder/types";
import { configToRecipes } from "../../../../lib/ts/templateBuilder/constants";
import { config } from "../../../shared/config/base";
import { getAppInfo } from "../../../shared/config/appInfo";
import { oAuthProviders } from "../../../backend/shared/config/oAuthProviders";
import { UserFlags } from "../../../../lib/ts/types";

interface TypeScriptTemplateOptions {
    configType: ConfigType;
    userArguments?: UserFlags;
    isFullStack?: boolean; // Added isFullStack flag
}

export const tsRecipeImports = {
    emailPassword: 'import EmailPassword from "supertokens-node/recipe/emailpassword";',
    thirdParty:
        'import ThirdParty from "supertokens-node/recipe/thirdparty";\nimport type { ProviderInput } from "supertokens-node/recipe/thirdparty/types";', // Use import type
    passwordless: 'import Passwordless from "supertokens-node/recipe/passwordless";',
    session: 'import Session from "supertokens-node/recipe/session";',
    dashboard: 'import Dashboard from "supertokens-node/recipe/dashboard";',
    userRoles: 'import UserRoles from "supertokens-node/recipe/userroles";',
    multiFactorAuth: 'import MultiFactorAuth from "supertokens-node/recipe/multifactorauth";',
    accountLinking: 'import AccountLinking from "supertokens-node/recipe/accountlinking";',
    emailVerification: 'import EmailVerification from "supertokens-node/recipe/emailverification";',
    totp: 'import TOTP from "supertokens-node/recipe/totp";',
    multitenancy: 'import Multitenancy from "supertokens-node/recipe/multitenancy";',
} as const;

export const tsRecipeInits = {
    emailPassword: () => `EmailPassword.init()`,
    thirdParty: (providers: OAuthProvider[]) => `ThirdParty.init({
            signInAndUpFeature: {
                providers: [
                    ${providers
                        .map(
                            (provider) => `{
                        config: {
                            thirdPartyId: "${provider.id}",
                            clients: [
                                {
                                    clientId: "${provider.clientId}",
                                    clientSecret: "${provider.clientSecret}",
                                    ${
                                        provider.additionalConfig
                                            ? `additionalConfig: ${JSON.stringify(provider.additionalConfig, null, 36)}`
                                            : ""
                                    }
                                },
                            ],
                        },
                    }`
                        )
                        .join(",\n                    ")}
                ],
            },
        })`,
    passwordless: (userArguments?: UserFlags) => {
        // Determine contact method and flow type based on user arguments
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

        // Determine contact method
        if ((hasLinkEmail || hasOtpEmail) && (hasLinkPhone || hasOtpPhone)) {
            contactMethod = "EMAIL_OR_PHONE";
        } else if (hasLinkPhone || hasOtpPhone) {
            contactMethod = "PHONE";
        } else {
            contactMethod = "EMAIL";
        }

        // Determine flow type
        const hasLinkFactor = hasLinkEmail || hasLinkPhone;
        const hasOtpFactor = hasOtpEmail || hasOtpPhone;

        if (hasLinkFactor && hasOtpFactor) {
            flowType = "USER_INPUT_CODE_AND_MAGIC_LINK";
        } else if (hasLinkFactor) {
            flowType = "MAGIC_LINK";
        } else if (hasOtpFactor) {
            flowType = "USER_INPUT_CODE";
        }

        return `Passwordless.init({
    contactMethod: "${contactMethod}",${flowType ? `\n    flowType: "${flowType}"` : ""}
})`;
    },
    session: () => `Session.init()`,
    dashboard: () => `Dashboard.init()`,
    userRoles: () => `UserRoles.init()`,
    multiFactorAuth: (firstFactors?: string[], secondFactors?: string[]) => {
        const firstFactorsStr = (firstFactors || ["thirdparty", "emailpassword"])
            .map((factor) => `"${factor}"`)
            .join(", ");

        let init = `MultiFactorAuth.init({
    firstFactors: [${firstFactorsStr}]`;

        if (secondFactors && secondFactors.length > 0) {
            const factorMapping: Record<string, string> = {
                totp: "TOTP",
                "otp-email": "OTP_EMAIL",
                "otp-phone": "OTP_PHONE",
                "link-email": "LINK_EMAIL",
                "link-phone": "LINK_PHONE",
                otp_email: "OTP_EMAIL",
                otp_phone: "OTP_PHONE",
                link_email: "LINK_EMAIL",
                link_phone: "LINK_PHONE",
            };

            const factorIds: string[] = [];
            secondFactors.forEach((factor) => {
                if (factorMapping[factor]) {
                    factorIds.push(`MultiFactorAuth.FactorIds.${factorMapping[factor]}`);
                }
            });

            if (factorIds.length > 0) {
                init += `,
    override: {
        functions: (oI) => ({
            ...oI,
            getMFARequirementsForAuth: async () => [
                {
                    oneOf: [
                        ${factorIds.join(",\n                        ")}
                    ],
                },
            ],
            // NOTE: Removing getRequiredSecondaryFactorsForUser override based on user feedback
            // getRequiredSecondaryFactorsForUser: async () => {
            //     return [${factorIds.join(", ")}];
            // },
        }),
    }`;
            }
        }

        init += `
})`;
        return init;
    },
    accountLinking: (hasMFA: boolean) => {
        // Reverting to returning plain object to avoid constructor/reference errors at runtime,
        // even though SDK might expect class instance. Underlying "not allowed to" error likely needs SDK fix.
        const shouldRequireVerification = hasMFA;
        return `AccountLinking.init({
            shouldDoAutomaticAccountLinking: async (
                newAccountInfo: AccountInfoWithRecipeId, // Corrected type
                user: User | undefined, // Use undefined directly instead of Optional<User>
                session: any, // Use any for session as SessionContainer import was removed
                tenantId: string,
                userContext: any // Use any for userContext instead of Dict<string, Any>
            ) => {
                // TODO: Add custom logic here based on your requirements
                return { // Return plain object
                    shouldAutomaticallyLink: true,
                    shouldRequireVerification: ${shouldRequireVerification}
                };
            }
        })`;
    },
    emailVerification: () => `EmailVerification.init({
        mode: "REQUIRED" // Revert back to REQUIRED
    })`,
    totp: () => `TOTP.init()`,
    multitenancy: () => `Multitenancy.init({
        override: {
            functions: (oI) => {
                return {
                    ...oI,
                    // Add any necessary overrides for Multitenancy + MFA interaction here
                };
            },
        },
    })`,
} as const;

export const generateTypeScriptTemplate = (
    {
        configType,
        userArguments,
        isFullStack = false, // Default to false
    }: TypeScriptTemplateOptions,
    _framework?: string // Keep framework for potential future use or logging
): string => {
    const recipes = configToRecipes[configType];
    const hasMFA =
        configType === "multifactorauth" || (userArguments?.secondfactors && userArguments.secondfactors.length > 0);

    // Add MFA recipes if needed
    if (hasMFA && !recipes.includes("multiFactorAuth")) {
        recipes.push("multiFactorAuth");
    }
    if (hasMFA && userArguments?.secondfactors?.includes("totp") && !recipes.includes("totp")) {
        recipes.push("totp");
    }
    if (hasMFA && !recipes.includes("emailVerification")) {
        recipes.push("emailVerification");
    }
    if (hasMFA && !recipes.includes("accountLinking")) {
        recipes.push("accountLinking");
    }

    // Add Passwordless recipe if any OTP/Link factors are used (first or second)
    const hasPasswordlessFactor =
        userArguments?.firstfactors?.some((f) => f.startsWith("otp-") || f.startsWith("link-")) ||
        userArguments?.secondfactors?.some((f) => f.startsWith("otp-") || f.startsWith("link-"));

    if (hasPasswordlessFactor && !recipes.includes("passwordless")) {
        recipes.push("passwordless");
    }

    // Get the correct appInfo based on fullstack context
    const appInfo = getAppInfo(isFullStack);

    // Generate imports
    let imports = recipes
        .map((recipe) => tsRecipeImports[recipe as keyof typeof tsRecipeImports])
        .filter(Boolean)
        .join("\n");

    // Add imports for types used in overrides
    if (recipes.includes("accountLinking")) {
        // Correct type name and remove problematic SessionContainer import path
        imports += `\nimport type { AccountInfoWithRecipeId } from "supertokens-node/recipe/accountlinking/types";`; // Corrected type name
        imports += `\nimport type { User } from "supertokens-node/types";`;
    }

    // Removed incorrect import from "typing"

    // Generate recipe initializations using a switch for clarity and type safety
    // Ensure Session is handled last
    const initRecipes = recipes.filter((r) => r !== "session");
    const sessionInitFunc = tsRecipeInits.session; // Assuming session init takes no args

    const recipeInits = initRecipes
        .map((recipe) => {
            switch (recipe) {
                case "thirdParty":
                    return tsRecipeInits.thirdParty(oAuthProviders);
                case "multiFactorAuth":
                    return tsRecipeInits.multiFactorAuth(userArguments?.firstfactors, userArguments?.secondfactors);
                case "accountLinking":
                    return tsRecipeInits.accountLinking(hasMFA ?? false); // Pass hasMFA, default to false if undefined
                case "passwordless":
                case "passwordless":
                    return tsRecipeInits.passwordless(userArguments);
                case "emailVerification": // Reverted: EV init takes no args now
                    return tsRecipeInits.emailVerification();
                // Add cases for other recipes that might need specific arguments in the future
                case "emailPassword":
                case "dashboard":
                case "userRoles":
                // case "emailVerification": // Handled separately below
                case "totp":
                case "multitenancy":
                    // Call recipes that don't require arguments (excluding EV)
                    const initFunc = tsRecipeInits[recipe];
                    if (typeof initFunc === "function") {
                        // We check if it's a function before calling
                        // Need to cast to any because TS struggles with indexed access signature inference here
                        return (initFunc as any)();
                    }
                    console.warn(`No initializer function found for recipe: ${recipe}`);
                    return null;
                default:
                    console.warn(`Unknown recipe encountered: ${recipe}`);
                    return null;
            }
        })
        .filter(Boolean); // Get array of init strings

    // Add Session.init() at the end
    recipeInits.push(sessionInitFunc());

    // Removed unused recipeInitsString variable

    // Construct the final template string
    let template =
        imports +
        "\n" +
        // Reverting to value import for TypeInput based on user's working config
        `import type { TypeInput } from "supertokens-node/types";

export function getApiDomain() {
    const apiPort = ${appInfo.defaultApiPort};
    const apiUrl = \`http://localhost:\${apiPort}\`;
    return apiUrl;
}

export function getWebsiteDomain() {
    const websitePort = ${appInfo.defaultWebsitePort};
    const websiteUrl = \`http://localhost:\${websitePort}\`;
    return websiteUrl;
}` +
        "\n";

    // Add configuration
    template += `\nexport const SuperTokensConfig: TypeInput = {
    supertokens: {
        connectionURI: "${config.connectionURI}",
    },
    appInfo: {
        appName: "${appInfo.appName}",
        apiDomain: getApiDomain(),
        websiteDomain: getWebsiteDomain(),
        apiBasePath: "${appInfo.apiBasePath}", // Use correct base path
        websiteBasePath: "${appInfo.websiteBasePath}", // Use correct base path
    },
    recipeList: [
        ${recipeInits.join(",\n        ")}
    ],
};`;

    return template;
};

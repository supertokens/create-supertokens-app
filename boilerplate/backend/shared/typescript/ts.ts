import { type OAuthProvider, type ConfigType } from "../../../../lib/ts/templateBuilder/types.js";
import { configToRecipes } from "../../../../lib/ts/templateBuilder/constants.js";
import { config } from "../../../shared/config/base.js";
import { getAppInfo } from "../../../shared/config/appInfo.js";
import { thirdPartyLoginProviders } from "../../../backend/shared/config/oAuthProviders.js";
import { UserFlags } from "../../../../lib/ts/types.js";

interface TypeScriptTemplateOptions {
    configType: ConfigType;
    userArguments?: UserFlags;
    isFullStack?: boolean;
}

export const tsRecipeImports = {
    emailPassword: 'import EmailPassword from "supertokens-node/recipe/emailpassword";',
    thirdParty:
        'import ThirdParty from "supertokens-node/recipe/thirdparty";\nimport type { ProviderInput } from "supertokens-node/recipe/thirdparty/types";',
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
        let contactMethod = "EMAIL";
        let flowType;

        const hasLinkEmail =
            userArguments?.firstfactors?.includes("link-email") || userArguments?.secondfactors?.includes("link-email");
        const hasLinkPhone =
            userArguments?.firstfactors?.includes("link-phone") || userArguments?.secondfactors?.includes("link-phone");
        const hasOtpEmail =
            userArguments?.firstfactors?.includes("otp-email") || userArguments?.secondfactors?.includes("otp-email");
        const hasOtpPhone =
            userArguments?.firstfactors?.includes("otp-phone") || userArguments?.secondfactors?.includes("otp-phone");

        if ((hasLinkEmail || hasOtpEmail) && (hasLinkPhone || hasOtpPhone)) {
            contactMethod = "EMAIL_OR_PHONE";
        } else if (hasLinkPhone || hasOtpPhone) {
            contactMethod = "PHONE";
        } else {
            contactMethod = "EMAIL";
        }

        const hasLinkFactor = hasLinkEmail || hasLinkPhone;
        const hasOtpFactor = hasOtpEmail || hasOtpPhone;

        if (hasLinkFactor && hasOtpFactor) {
            flowType = "USER_INPUT_CODE_AND_MAGIC_LINK";
        } else if (hasLinkFactor) {
            flowType = "MAGIC_LINK";
        } else if (hasOtpFactor) {
            flowType = "USER_INPUT_CODE";
        }

        if (flowType === undefined) {
            flowType = "USER_INPUT_CODE_AND_MAGIC_LINK";
        }

        return `Passwordless.init({
    contactMethod: "${contactMethod}",
    flowType: "${flowType}"
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
        }),
    }`;
            }
        }

        init += `
})`;
        return init;
    },
    accountLinking: (hasMFA: boolean) => {
        const shouldRequireVerification = hasMFA;
        return `AccountLinking.init({
            shouldDoAutomaticAccountLinking: async (
                newAccountInfo: AccountInfoWithRecipeId,
                user: User | undefined,
                session: any,
                tenantId: string,
                userContext: any
            ) => {
                return {
                    shouldAutomaticallyLink: true,
                    shouldRequireVerification: ${shouldRequireVerification}
                };
            }
        })`;
    },
    emailVerification: () => `EmailVerification.init({
        mode: "REQUIRED"
    })`,
    totp: () => `TOTP.init()`,
    multitenancy: () => `Multitenancy.init({
        override: {
            functions: (oI) => {
                return {
                    ...oI,
                };
            },
        },
    })`,
} as const;

export const generateTypeScriptTemplate = (
    { configType, userArguments, isFullStack = false }: TypeScriptTemplateOptions,
    _framework?: string
): string => {
    const recipes = configToRecipes[configType];
    const hasMFA =
        configType === "multifactorauth" || (userArguments?.secondfactors && userArguments.secondfactors.length > 0);

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

    const hasPasswordlessFactor =
        userArguments?.firstfactors?.some((f: string) => f.startsWith("otp-") || f.startsWith("link-")) ||
        userArguments?.secondfactors?.some((f: string) => f.startsWith("otp-") || f.startsWith("link-"));

    if (hasPasswordlessFactor && !recipes.includes("passwordless")) {
        recipes.push("passwordless");
    }

    if (configType === "multitenancy") {
        if (!recipes.includes("emailPassword")) {
            recipes.push("emailPassword");
        }
        if (!recipes.includes("thirdParty")) {
            recipes.push("thirdParty");
        }
        if (!recipes.includes("passwordless")) {
            recipes.push("passwordless");
        }

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
    }

    const appInfo = getAppInfo(isFullStack);

    let imports = recipes
        .map((recipe: string) => tsRecipeImports[recipe as keyof typeof tsRecipeImports])
        .filter(Boolean)
        .join("\n");

    if (recipes.includes("accountLinking")) {
        imports += `\nimport type { AccountInfoWithRecipeId } from "supertokens-node/recipe/accountlinking/types";`;
        imports += `\nimport type { User } from "supertokens-node/types";`;
    }

    const initRecipes = recipes.filter((r: string) => r !== "session");
    const sessionInitFunc = tsRecipeInits.session;

    const recipeInits = initRecipes
        .map((recipe: string) => {
            switch (recipe) {
                case "thirdParty":
                    const providersToUse = userArguments?.providers
                        ? thirdPartyLoginProviders.filter((p: OAuthProvider) => userArguments.providers!.includes(p.id))
                        : thirdPartyLoginProviders;
                    return tsRecipeInits.thirdParty(providersToUse);
                case "multiFactorAuth":
                    return tsRecipeInits.multiFactorAuth(userArguments?.firstfactors, userArguments?.secondfactors);
                case "accountLinking":
                    return tsRecipeInits.accountLinking(hasMFA ?? false);
                case "passwordless":
                case "passwordless":
                    return tsRecipeInits.passwordless(userArguments);
                case "emailVerification":
                    return tsRecipeInits.emailVerification();
                case "emailPassword":
                case "dashboard":
                case "userRoles":
                case "totp":
                case "multitenancy":
                    const initFunc = tsRecipeInits[recipe];
                    if (typeof initFunc === "function") {
                        return (initFunc as any)();
                    }
                    console.warn(`No initializer function found for recipe: ${recipe}`);
                    return null;
                default:
                    console.warn(`Unknown recipe encountered: ${recipe}`);
                    return null;
            }
        })
        .filter(Boolean);

    recipeInits.push(sessionInitFunc());

    let template =
        imports +
        "\n" +
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

    template += `\nexport const SuperTokensConfig: TypeInput = {
    supertokens: {
        connectionURI: "${config.connectionURI}",
    },
    appInfo: {
        appName: "${appInfo.appName}",
        apiDomain: getApiDomain(),
        websiteDomain: getWebsiteDomain(),
        apiBasePath: "${appInfo.apiBasePath}", 
        websiteBasePath: "${appInfo.websiteBasePath}", 
    },
    recipeList: [
        ${recipeInits.join(",\n        ")}
    ],
};`;

    return template;
};

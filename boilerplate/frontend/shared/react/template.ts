import { UserFlags } from "../../../../lib/ts/types";
import { type ConfigType } from "../../../../lib/ts/templateBuilder/types";
import { getAppInfo } from "../../../shared/config/appInfo";

interface ReactTemplate {
    configType: ConfigType;
    userArguments?: UserFlags;
    isFullStack?: boolean;
    // Removed unused _framework parameter
}

export const reactRecipeImports = {
    emailPassword:
        'import EmailPassword from "supertokens-auth-react/recipe/emailpassword";\nimport { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";',
    thirdParty:
        'import ThirdParty, { Google, Github, Apple, Twitter } from "supertokens-auth-react/recipe/thirdparty";\nimport { ThirdPartyPreBuiltUI } from "supertokens-auth-react/recipe/thirdparty/prebuiltui";',
    passwordless:
        'import Passwordless, { PasswordlessComponentsOverrideProvider } from "supertokens-auth-react/recipe/passwordless";\nimport { PasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/passwordless/prebuiltui";',
    session: 'import Session from "supertokens-auth-react/recipe/session";',
    multiFactorAuth:
        'import MultiFactorAuth from "supertokens-auth-react/recipe/multifactorauth";\nimport { MultiFactorAuthPreBuiltUI } from "supertokens-auth-react/recipe/multifactorauth/prebuiltui";',
    emailVerification:
        'import EmailVerification from "supertokens-auth-react/recipe/emailverification";\nimport { EmailVerificationPreBuiltUI } from "supertokens-auth-react/recipe/emailverification/prebuiltui";',
    totp: 'import TOTP from "supertokens-auth-react/recipe/totp";\nimport { TOTPPreBuiltUI } from "supertokens-auth-react/recipe/totp/prebuiltui";',
    multitenancy: 'import Multitenancy from "supertokens-auth-react/recipe/multitenancy";',
    // Removed Dashboard and UserRoles imports as they don't exist in supertokens-auth-react
};

export const reactRecipeInits = {
    emailPassword: () => `EmailPassword.init()`,
    thirdParty: () => `ThirdParty.init({
            signInAndUpFeature: {
                providers: [
                    Github.init(),
                    Google.init(),
                    Apple.init(),
                    Twitter.init(),
                ],
            },
        })`,
    passwordless: (userArguments?: UserFlags) => {
        // Determine contact method based on user arguments
        let contactMethod = "EMAIL";
        // Removed flowType again as it's not used in the return string

        const hasLinkEmail =
            userArguments?.firstfactors?.includes("link-email") || userArguments?.secondfactors?.includes("link-email");
        const hasLinkPhone =
            userArguments?.firstfactors?.includes("link-phone") || userArguments?.secondfactors?.includes("link-phone");
        const hasOtpEmail =
            userArguments?.firstfactors?.includes("otp-email") || userArguments?.secondfactors?.includes("otp-email");
        const hasOtpPhone =
            userArguments?.firstfactors?.includes("otp-phone") || userArguments?.secondfactors?.includes("otp-phone");

        // Determine contact method based on factors
        if ((hasLinkEmail || hasOtpEmail) && (hasLinkPhone || hasOtpPhone)) {
            contactMethod = "EMAIL_OR_PHONE";
        } else if (hasLinkPhone || hasOtpPhone) {
            contactMethod = "PHONE";
        } else {
            contactMethod = "EMAIL";
        }

        // Determine flow type based on factors
        // Note: The documentation states that if both otp_email and otp_phone are present,
        // the flowType becomes "USER_INPUT_CODE_AND_MAGIC_LINK"
        // Removed assignments to flowType as it's not used in the init string below
        // if ((hasOtpEmail || hasOtpPhone) && (hasLinkEmail || hasLinkPhone)) {
        //     // flowType = "USER_INPUT_CODE_AND_MAGIC_LINK";
        // } else if (hasLinkEmail || hasLinkPhone) {
        //     // flowType = "MAGIC_LINK";
        // } else if (hasOtpEmail || hasOtpPhone) {
        //     // flowType = "USER_INPUT_CODE";
        // }

        // The flowType seems to be inferred by SuperTokens or might cause type errors,
        // so we only explicitly set the contactMethod.
        const initObj = [`contactMethod: "${contactMethod}"`];

        return `Passwordless.init({
            ${initObj.join(",\n            ")}
        })`;
    },
    session: (hasMFA: boolean = false) => {
        if (!hasMFA) {
            return `Session.init()`;
        }

        // When using MFA, we need to adjust the order of claim validators to prioritize MFA
        return `Session.init({
            override: {
                functions: (original) => {
                    return {
                        ...original,
                        getGlobalClaimValidators: (input) => {
                            const emailVerificationClaimValidator = input.claimValidatorsAddedByOtherRecipes.find(
                                v => v.id === EmailVerification.EmailVerificationClaim.id
                            );
                            if (emailVerificationClaimValidator) {
                                // We filter out the email verification validator and add it at the end
                                // This ensures MFA validator gets priority
                                const filteredValidators = input.claimValidatorsAddedByOtherRecipes.filter(
                                    v => v.id !== EmailVerification.EmailVerificationClaim.id
                                );
                                return [...filteredValidators, emailVerificationClaimValidator];
                            }
                            return input.claimValidatorsAddedByOtherRecipes;
                        }
                    };
                }
            }
        })`;
    },
    multiFactorAuth: (firstFactors?: string[], secondFactors?: string[]) => {
        // For React, determine the appropriate firstFactors based on user configuration
        const availableFirstFactors: string[] = [];

        if (firstFactors) {
            if (firstFactors.includes("emailpassword")) {
                availableFirstFactors.push("emailpassword");
            }
            if (firstFactors.includes("thirdparty")) {
                availableFirstFactors.push("thirdparty");
            }
            // Check for passwordless first factors
            const hasPasswordless = firstFactors.some((f) => f.startsWith("link-") || f.startsWith("otp-"));
            if (hasPasswordless) {
                availableFirstFactors.push("passwordless");
            }
        } else {
            // Default values if no first factors are specified
            availableFirstFactors.push("thirdparty", "emailpassword");
        }

        // If we have second factors, we need to include the override function
        if (secondFactors && secondFactors.length > 0) {
            // Map the second factors to the correct FactorIds
            const factorMapping: Record<string, string> = {
                totp: "MultiFactorAuth.FactorIds.TOTP",
                "otp-email": "MultiFactorAuth.FactorIds.OTP_EMAIL",
                "otp-phone": "MultiFactorAuth.FactorIds.OTP_PHONE",
                "link-email": "MultiFactorAuth.FactorIds.LINK_EMAIL",
                "link-phone": "MultiFactorAuth.FactorIds.LINK_PHONE",
            };

            const factorIds = secondFactors.map((factor) => factorMapping[factor] || `"${factor}"`).filter(Boolean);

            if (factorIds.length > 0) {
                return `MultiFactorAuth.init({
        firstFactors: [${availableFirstFactors.map((f) => `"${f}"`).join(", ")}],
        override: {
            functions: (originalImplementation) => ({
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
        return `MultiFactorAuth.init({
        firstFactors: [${availableFirstFactors.map((f) => `"${f}"`).join(", ")}]
    })`;
    },
    // Set mode based on MFA status
    emailVerification: (hasMFA?: boolean) => `EmailVerification.init({
        mode: ${hasMFA ? '"OPTIONAL"' : '"REQUIRED"'}
    })`,
    totp: () => `TOTP.init()`,
    multitenancy: () => `Multitenancy.init({
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
    // Removed Dashboard and UserRoles initializers
};

export const reactPreBuiltUIs = {
    emailPassword: "EmailPasswordPreBuiltUI",
    thirdParty: "ThirdPartyPreBuiltUI",
    passwordless: "PasswordlessPreBuiltUI",
    multiFactorAuth: "MultiFactorAuthPreBuiltUI",
    emailVerification: "EmailVerificationPreBuiltUI",
    totp: "TOTPPreBuiltUI",
    // Removed Dashboard and UserRoles PreBuiltUI names
};

export const generateReactTemplate = ({ configType, userArguments, isFullStack }: ReactTemplate): string => {
    const appInfo = getAppInfo(isFullStack);
    const hasMFA = userArguments?.secondfactors && userArguments.secondfactors.length > 0;
    // Removed unused hasEmailFactors and hasPhoneFactors
    const hasTOTP = userArguments?.secondfactors?.includes("totp");

    // According to the tables, if both link_email and link_phone are present, contactMethod becomes "EMAIL_OR_PHONE"
    // Note: The documentation in react.mdc incorrectly states "EMAIL_OR_PASSWORD" but it should be "EMAIL_OR_PHONE"
    // Removed unused contactMethod variable

    // Build the list of recipes needed
    const recipes: string[] = [];
    const prebuiltUIs: string[] = [];

    // Add recipes based on config type or if they're used as first factors in MFA
    const hasEmailPasswordFirstFactor = userArguments?.firstfactors?.includes("emailpassword") || false;
    if (configType === "emailpassword" || configType === "all_auth" || hasEmailPasswordFirstFactor) {
        recipes.push("emailPassword");
        prebuiltUIs.push(reactPreBuiltUIs.emailPassword);
    }

    // ThirdParty recipe
    const hasThirdPartyFirstFactor = userArguments?.firstfactors?.includes("thirdparty") || false;
    if (configType.includes("thirdparty") || configType === "all_auth" || hasThirdPartyFirstFactor) {
        recipes.push("thirdParty");
        prebuiltUIs.push(reactPreBuiltUIs.thirdParty);
    }

    // Passwordless recipe - must come before any MFA config
    const hasPasswordlessSecondFactors =
        userArguments?.secondfactors?.some(
            (factor) => factor.includes("email") || factor.includes("phone") || factor.includes("link")
        ) || false;

    const hasPasswordlessFirstFactors =
        userArguments?.firstfactors?.some((factor) => factor.includes("link-") || factor.includes("otp-")) || false;

    if (
        configType === "passwordless" ||
        configType === "thirdpartypasswordless" ||
        configType === "all_auth" ||
        hasPasswordlessSecondFactors ||
        hasPasswordlessFirstFactors
    ) {
        recipes.push("passwordless");
        prebuiltUIs.push(reactPreBuiltUIs.passwordless);
    }

    // Multi-factor auth - must come after the auth recipes
    if (hasMFA) {
        recipes.push("multiFactorAuth");
        prebuiltUIs.push(reactPreBuiltUIs.multiFactorAuth);

        // Add EmailVerification for MFA as per documentation
        recipes.push("emailVerification");
        prebuiltUIs.push(reactPreBuiltUIs.emailVerification);

        // Add TOTP if needed
        if (hasTOTP) {
            recipes.push("totp");
            prebuiltUIs.push(reactPreBuiltUIs.totp);
        }
    }

    // Add Multitenancy if needed
    if (configType === "multitenancy") {
        recipes.push("multitenancy");
        // Note: Multitenancy doesn't have a PreBuiltUI export
    }

    // Removed unconditional addition of Dashboard and UserRoles

    // Always include Session - must be last in recipe list for init, but UI can be anywhere
    recipes.push("session");
    // Session does not have a PreBuiltUI component

    // Generate imports
    const imports = recipes
        .map((recipe) => reactRecipeImports[recipe as keyof typeof reactRecipeImports])
        .filter(Boolean)
        .join("\n");

    // Generate initializations using a switch for clarity
    const recipeInits = recipes
        .map((recipe) => {
            switch (recipe) {
                case "passwordless":
                    return reactRecipeInits.passwordless(userArguments);
                case "multiFactorAuth":
                    return reactRecipeInits.multiFactorAuth(userArguments?.firstfactors, userArguments?.secondfactors);
                case "session":
                    return reactRecipeInits.session(hasMFA);
                case "emailVerification": // Handle EV separately
                    return reactRecipeInits.emailVerification(hasMFA ?? false);
                // Add cases for other recipes that might need specific arguments in the future
                case "emailPassword":
                case "thirdParty":
                // Removed dashboard and userRoles cases as they don't have initializers
                case "totp":
                case "multitenancy":
                    // Call recipes that don't require arguments
                    const initFunc = reactRecipeInits[recipe];
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

    // Generate the template following the pattern in final-shape-tables.mdc
    const template = `${imports}

export function getApiDomain() {
    // Use only appInfo defaults
    const apiPort = ${appInfo.defaultApiPort};
    const apiUrl = \`http://localhost:\${apiPort}\`;
    return apiUrl;
}

export function getWebsiteDomain() {
    // Use only appInfo defaults
    const websitePort = ${appInfo.defaultWebsitePort};
    const websiteUrl = \`http://localhost:\${websitePort}\`;
    return websiteUrl;
}

${
    configType === "passwordless" ||
    configType === "thirdpartypasswordless" ||
    configType === "all_auth" ||
    configType === "multitenancy"
        ? `export const styleOverride = \`
[data-supertokens~=container] {
    --palette-background: #ffffff;
    --palette-inputBackground: #ffffff;
    --palette-inputBorder: #dddddd;
    --palette-textTitle: #222222;
    --palette-textLabel: #222222;
    --palette-textPrimary: #222222;
    --palette-error: #ff1717;
    --palette-textInput: #222222;
    --palette-textLink: #4949e4;
    --palette-buttonText: #ffffff;
    --palette-primary: #4949e4;
    --palette-success: #41a700;
    
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    width: 420px;
    margin: 0 auto;
    text-align: center;
}

[data-supertokens~=tenants-link] {
    margin-top: 8px;
}
\`;`
        : ""
}

export const SuperTokensConfig = {
    appInfo: {
        appName: "${appInfo.appName}",
        apiDomain: getApiDomain(),
        websiteDomain: getWebsiteDomain(),
        apiBasePath: "${appInfo.apiBasePath}", // Add apiBasePath
        websiteBasePath: "${appInfo.websiteBasePath}", // Add websiteBasePath
    },
    ${configType === "multitenancy" ? "usesDynamicLoginMethods: true,\n    " : ""}${
        configType === "passwordless" ||
        configType === "thirdpartypasswordless" ||
        configType === "all_auth" ||
        configType === "multitenancy"
            ? "style: styleOverride,\n    "
            : ""
    }// recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
        ${recipeInits.join(",\n        ")}
    ],
    getRedirectionURL: async (context: {action: string; newSessionCreated: boolean}) => {
        if (context.action === "SUCCESS" && context.newSessionCreated) {
            return "/dashboard";
        }
    },
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/${(() => {
        // Handle docs link based on configuration
        if (configType === "thirdpartypasswordless") return "thirdpartypasswordless";
        if (configType === "emailpassword") return "emailpassword";
        if (configType === "passwordless") return "passwordless";
        if (configType.includes("thirdparty")) return "thirdparty";
        if (configType === "multitenancy") return "multitenancy";
        if (configType === "all_auth") return "thirdpartypasswordless";
        if (hasMFA) return "mfa";
        return String(configType);
    })()}/introduction",
};

export const PreBuiltUIList = [${prebuiltUIs.join(", ")}];

export const ComponentWrapper = (props: { children: JSX.Element }): JSX.Element => {
    ${
        configType === "passwordless" ||
        configType === "thirdpartypasswordless" ||
        configType === "all_auth" ||
        userArguments?.secondfactors?.some(
            (factor) => factor.includes("email") || factor.includes("phone") || factor.includes("link")
        )
            ? `return (
        <PasswordlessComponentsOverrideProvider
            components={{
                PasswordlessUserInputCodeFormFooter_Override: ({ DefaultComponent, ...props }) => {
                    const loginAttemptInfo = props.loginAttemptInfo;
                    let showQuotaMessage = false;

                    if (loginAttemptInfo.contactMethod === "PHONE") {
                        showQuotaMessage = true;
                    }

                    return (
                        <div
                            style={{
                                width: "100%",
                            }}
                        >
                            <DefaultComponent {...props} />
                            {showQuotaMessage && (
                                <div
                                    style={{
                                        width: "100%",
                                        paddingLeft: 12,
                                        paddingRight: 12,
                                        paddingTop: 6,
                                        paddingBottom: 6,
                                        borderRadius: 4,
                                        backgroundColor: "#EF9A9A",
                                        margin: 0,
                                        boxSizing: "border-box",
                                        MozBoxSizing: "border-box",
                                        WebkitBoxSizing: "border-box",
                                        fontSize: 12,
                                        textAlign: "start",
                                        fontWeight: "bold",
                                        lineHeight: "18px",
                                    }}
                                >
                                    There is a daily quota for the free SMS service, if you do not receive the SMS
                                    please try again tomorrow.
                                </div>
                            )}
                        </div>
                    );
                },
            }}
        >
            {props.children}
        </PasswordlessComponentsOverrideProvider>
    );`
            : `return props.children;`
    }
};`;

    return template;
};

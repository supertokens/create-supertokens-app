import { getAppInfo } from "../../../shared/config/appInfo";
import { thirdPartyLoginProviders } from "../../../backend/shared/config/oAuthProviders";
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
};
export const reactRecipeInits = {
    emailPassword: () => `EmailPassword.init()`,
    thirdParty: (providers) => {
        const providerInitMap = {
            google: "Google.init()",
            github: "Github.init()",
            apple: "Apple.init()",
            twitter: "Twitter.init()",
        };
        const providerInits = providers
            .map((p) => providerInitMap[p.id])
            .filter(Boolean)
            .join(",\n                    ");
        return `ThirdParty.init({
            signInAndUpFeature: {
                providers: [
                    ${providerInits}
                ],
            },
        })`;
    },
    passwordless: (userArguments) => {
        let contactMethod = "EMAIL";
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
        const initObj = [`contactMethod: "${contactMethod}"`];
        return `Passwordless.init({
            ${initObj.join(",\n            ")}
        })`;
    },
    session: (hasMFA = false) => {
        if (!hasMFA) {
            return `Session.init()`;
        }
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
    multiFactorAuth: (firstFactors, secondFactors) => {
        const availableFirstFactors = [];
        if (firstFactors) {
            if (firstFactors.includes("emailpassword")) {
                availableFirstFactors.push("emailpassword");
            }
            if (firstFactors.includes("thirdparty")) {
                availableFirstFactors.push("thirdparty");
            }
            const hasPasswordless = firstFactors.some((f) => f.startsWith("link-") || f.startsWith("otp-"));
            if (hasPasswordless) {
                availableFirstFactors.push("passwordless");
            }
        } else {
            availableFirstFactors.push("thirdparty", "emailpassword");
        }
        if (secondFactors && secondFactors.length > 0) {
            const factorMapping = {
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
                getRequiredSecondaryFactorsForUser: async () => {
                    return [${factorIds.join(", ")}];
                },
            }),
        }
    })`;
            }
        }
        return `MultiFactorAuth.init({
        firstFactors: [${availableFirstFactors.map((f) => `"${f}"`).join(", ")}]
    })`;
    },
    emailVerification: (hasMFA) => `EmailVerification.init({
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
};
export const reactPreBuiltUIs = {
    emailPassword: "EmailPasswordPreBuiltUI",
    thirdParty: "ThirdPartyPreBuiltUI",
    passwordless: "PasswordlessPreBuiltUI",
    multiFactorAuth: "MultiFactorAuthPreBuiltUI",
    emailVerification: "EmailVerificationPreBuiltUI",
    totp: "TOTPPreBuiltUI",
};
export const generateReactTemplate = ({ configType, userArguments, isFullStack }) => {
    const appInfo = getAppInfo(isFullStack);
    const hasMFA = userArguments?.secondfactors && userArguments.secondfactors.length > 0;
    const hasTOTP = userArguments?.secondfactors?.includes("totp");
    const recipes = [];
    const prebuiltUIs = [];
    const hasEmailPasswordFirstFactor = userArguments?.firstfactors?.includes("emailpassword") || false;
    if (configType === "emailpassword" || configType === "all_auth" || hasEmailPasswordFirstFactor) {
        recipes.push("emailPassword");
        prebuiltUIs.push(reactPreBuiltUIs.emailPassword);
    }
    const hasThirdPartyFirstFactor = userArguments?.firstfactors?.includes("thirdparty") || false;
    if (configType.includes("thirdparty") || configType === "all_auth" || hasThirdPartyFirstFactor) {
        recipes.push("thirdParty");
        prebuiltUIs.push(reactPreBuiltUIs.thirdParty);
    }
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
    if (hasMFA) {
        recipes.push("multiFactorAuth");
        prebuiltUIs.push(reactPreBuiltUIs.multiFactorAuth);
        recipes.push("emailVerification");
        prebuiltUIs.push(reactPreBuiltUIs.emailVerification);
        if (hasTOTP) {
            recipes.push("totp");
            prebuiltUIs.push(reactPreBuiltUIs.totp);
        }
    }
    if (configType === "multitenancy") {
        recipes.push("multitenancy");
        const allPossibleUIRecipes = [
            "emailPassword",
            "thirdParty",
            "passwordless",
            "multiFactorAuth",
            "emailVerification",
            "totp",
        ];
        allPossibleUIRecipes.forEach((recipeName) => {
            if (!recipes.includes(recipeName)) {
                recipes.push(recipeName);
            }
            const uiName = reactPreBuiltUIs[recipeName];
            if (uiName && !prebuiltUIs.includes(uiName)) {
                prebuiltUIs.push(uiName);
            }
        });
    }
    if (!recipes.includes("session")) {
        recipes.push("session");
    }
    const imports = recipes
        .map((recipe) => reactRecipeImports[recipe])
        .filter(Boolean)
        .join("\n");
    const recipeInits = recipes
        .map((recipe) => {
            switch (recipe) {
                case "passwordless":
                    return reactRecipeInits.passwordless(userArguments);
                case "multiFactorAuth":
                    return reactRecipeInits.multiFactorAuth(userArguments?.firstfactors, userArguments?.secondfactors);
                case "session":
                    return reactRecipeInits.session(hasMFA);
                case "emailVerification":
                    return reactRecipeInits.emailVerification(hasMFA ?? false);
                case "emailPassword": {
                    const initFunc = reactRecipeInits[recipe];
                    return initFunc();
                }
                case "thirdParty": {
                    const providersToUse = userArguments?.providers
                        ? thirdPartyLoginProviders.filter((p) => userArguments.providers.includes(p.id))
                        : thirdPartyLoginProviders;
                    return reactRecipeInits.thirdParty(providersToUse);
                }
                case "totp":
                case "multitenancy":
                    const initFunc = reactRecipeInits[recipe];
                    if (typeof initFunc === "function") {
                        return initFunc();
                    }
                    console.warn(`No initializer function found for recipe: ${recipe}`);
                    return null;
                default:
                    console.warn(`Unknown recipe encountered: ${recipe}`);
                    return null;
            }
        })
        .filter(Boolean);
    const template = `${imports}

export function getApiDomain() {
    const apiPort = ${appInfo.defaultApiPort};
    const apiUrl = \`http://localhost:\${apiPort}\`;
    return apiUrl;
}

export function getWebsiteDomain() {
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
        apiBasePath: "${appInfo.apiBasePath}",
        websiteBasePath: "${appInfo.websiteBasePath}",
    },
    ${configType === "multitenancy" ? "usesDynamicLoginMethods: true,\n    " : ""}${
        configType === "passwordless" ||
        configType === "thirdpartypasswordless" ||
        configType === "all_auth" ||
        configType === "multitenancy"
            ? "style: styleOverride,\n    "
            : ""
    }
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
    docsLink: "https://supertokens.com/docs/quickstart/introduction",
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

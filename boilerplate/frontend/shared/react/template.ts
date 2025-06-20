import { UserFlags } from "../../../../lib/ts/types.js";
import { type ConfigType, type OAuthProvider } from "../../../../lib/ts/templateBuilder/types.js";
import { getAppInfo } from "../../../shared/config/appInfo.js";
import { thirdPartyLoginProviders } from "../../../backend/shared/config/oAuthProviders.js";

interface ReactTemplate {
    configType: ConfigType;
    userArguments?: UserFlags;
    isFullStack?: boolean;
}

export const reactRecipeImports = {
    emailPassword:
        'import EmailPassword from "supertokens-auth-react/recipe/emailpassword";\nimport { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";',
    thirdParty:
        'import ThirdParty from "supertokens-auth-react/recipe/thirdparty";\nimport { ThirdPartyPreBuiltUI } from "supertokens-auth-react/recipe/thirdparty/prebuiltui";',
    passwordless:
        'import Passwordless, { PasswordlessComponentsOverrideProvider } from "supertokens-auth-react/recipe/passwordless";\nimport { PasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/passwordless/prebuiltui";',
    session: 'import Session from "supertokens-auth-react/recipe/session";',
    multiFactorAuth:
        'import MultiFactorAuth from "supertokens-auth-react/recipe/multifactorauth";\nimport { MultiFactorAuthPreBuiltUI } from "supertokens-auth-react/recipe/multifactorauth/prebuiltui";',
    emailVerification:
        'import EmailVerification from "supertokens-auth-react/recipe/emailverification";\nimport { EmailVerificationPreBuiltUI } from "supertokens-auth-react/recipe/emailverification/prebuiltui";',
    totp: 'import TOTP from "supertokens-auth-react/recipe/totp";\nimport { TOTPPreBuiltUI } from "supertokens-auth-react/recipe/totp/prebuiltui";',
    multitenancy: 'import Multitenancy from "supertokens-auth-react/recipe/multitenancy";',
    webauthn:
        'import WebAuthn from "supertokens-auth-react/recipe/webauthn";\nimport { WebauthnPreBuiltUI } from "supertokens-auth-react/recipe/webauthn/prebuiltui";',
};

export const reactRecipeInits = {
    emailPassword: () => `EmailPassword.init()`,
    thirdParty: (providers: OAuthProvider[]) => {
        const providerInitMap: Record<string, string> = {
            google: "ThirdParty.Google.init()",
            github: "ThirdParty.Github.init()",
            apple: "ThirdParty.Apple.init()",
            twitter: "ThirdParty.Twitter.init()",
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
    passwordless: (userArguments?: UserFlags) => {
        let contactMethod = "EMAIL";

        const hasLinkEmail = userArguments?.firstfactors?.includes("link-email");
        const hasLinkPhone = userArguments?.firstfactors?.includes("link-phone");
        const hasOtpEmail = userArguments?.firstfactors?.includes("otp-email");
        const hasOtpPhone = userArguments?.firstfactors?.includes("otp-phone");

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
    session: () => `Session.init()`,
    multiFactorAuth: (firstFactors?: string[], secondFactors?: string[]) => {
        const availableFirstFactors: string[] = [];

        if (firstFactors) {
            if (firstFactors.includes("emailpassword")) {
                availableFirstFactors.push("emailpassword");
            }
            if (firstFactors.includes("thirdparty")) {
                availableFirstFactors.push("thirdparty");
            }
            firstFactors.forEach((factor) => {
                if (factor.startsWith("otp-") || factor.startsWith("link-")) {
                    if (!availableFirstFactors.includes(factor)) {
                        availableFirstFactors.push(factor);
                    }
                }
            });
        } else {
            availableFirstFactors.push("thirdparty", "emailpassword");
        }

        if (secondFactors && secondFactors.length > 0) {
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
        firstFactors: [${availableFirstFactors.map((f) => `"${f}"`).join(", ")}]
    })`;
            }
        }

        return `MultiFactorAuth.init({
        firstFactors: [${availableFirstFactors.map((f) => `"${f}"`).join(", ")}]
    })`;
    },
    emailVerification: (hasMFA?: boolean) => `EmailVerification.init({
        mode: ${hasMFA ? '"OPTIONAL"' : '"REQUIRED"'}
    })`,
    webauthn: () => `WebAuthn.init()`,
    totp: () => `TOTP.init()`,
    multitenancy: () => `Multitenancy.init({
            override: {
                functions: (oI) => {
                    return {
                        ...oI,
                        getTenantId: async () => {
                            if (typeof window !== 'undefined') {
                                const tenantIdInStorage = localStorage.getItem("tenantId");
                                return tenantIdInStorage === null ? undefined : tenantIdInStorage;
                            }
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
    webauthn: "WebauthnPreBuiltUI",
};

export const generateReactTemplate = ({ configType, userArguments, isFullStack }: ReactTemplate): string => {
    const appInfo = getAppInfo(isFullStack);
    const hasMFA = userArguments?.secondfactors && userArguments.secondfactors.length > 0;
    const hasTOTP = userArguments?.secondfactors?.includes("totp");

    const recipes: string[] = [];
    const prebuiltUIs: string[] = [];

    const hasEmailPasswordFirstFactor = userArguments?.firstfactors?.includes("emailpassword") || false;
    if (configType === "emailpassword" || configType === "all_auth" || hasEmailPasswordFirstFactor) {
        recipes.push("emailPassword");
        prebuiltUIs.push(reactPreBuiltUIs.emailPassword);
    }

    if (configType === "webauthn") {
        recipes.push("webauthn");
        prebuiltUIs.push(reactPreBuiltUIs.webauthn);
    }

    const hasThirdPartyFirstFactor = userArguments?.firstfactors?.includes("thirdparty") || false;
    if (configType.includes("thirdparty") || configType === "all_auth" || hasThirdPartyFirstFactor) {
        recipes.push("thirdParty");
        prebuiltUIs.push(reactPreBuiltUIs.thirdParty);
    }

    const hasPasswordlessSecondFactors =
        userArguments?.secondfactors?.some(
            (factor: string) => factor.includes("email") || factor.includes("phone") || factor.includes("link")
        ) || false;

    const hasPasswordlessFirstFactors =
        userArguments?.firstfactors?.some((factor: string) => factor.includes("link-") || factor.includes("otp-")) ||
        false;

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
            "webauthn",
            "totp",
        ];

        allPossibleUIRecipes.forEach((recipeName: string) => {
            if (!recipes.includes(recipeName)) {
                recipes.push(recipeName);
            }
            const uiName = reactPreBuiltUIs[recipeName as keyof typeof reactPreBuiltUIs];
            if (uiName && !prebuiltUIs.includes(uiName)) {
                prebuiltUIs.push(uiName);
            }
        });
    }

    if (!recipes.includes("session")) {
        recipes.push("session");
    }
    const imports = recipes
        .map((recipe: string) => reactRecipeImports[recipe as keyof typeof reactRecipeImports])
        .filter(Boolean)
        .join("\n");

    const additionalImports: string[] = [];
    if (configType === "multitenancy") {
        additionalImports.push('import { useState, useEffect } from "react";');
    }

    const recipeInits = recipes
        .map((recipe: string) => {
            switch (recipe) {
                case "passwordless":
                    return reactRecipeInits.passwordless(userArguments);
                case "multiFactorAuth":
                    return reactRecipeInits.multiFactorAuth(userArguments?.firstfactors, userArguments?.secondfactors);
                case "session":
                    return reactRecipeInits.session();
                case "emailVerification":
                    return reactRecipeInits.emailVerification(hasMFA ?? false);
                case "emailPassword": {
                    const initFunc = reactRecipeInits[recipe];
                    return initFunc();
                }
                case "webauthn": {
                    const initFunc = reactRecipeInits[recipe];
                    return initFunc();
                }
                case "thirdParty": {
                    const providersToUse = userArguments?.providers
                        ? thirdPartyLoginProviders.filter((p: OAuthProvider) => userArguments.providers!.includes(p.id))
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

    const template = `
"use client";

${imports}
${additionalImports.join("\n")}

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
    getRedirectionURL: async (context: any) => {
        if (context.action === "SUCCESS") {
            if ((context as any).newSessionCreated) {
                return "/dashboard";
            }
        }
        return undefined;
    },
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/quickstart/introduction",
};

export const PreBuiltUIList = [${prebuiltUIs.join(", ")}];

${
    configType === "multitenancy"
        ? `
interface Tenant {
    tenantId: string;
}

const tenantLoader = async (): Promise<Tenant[]> => {
    try {
        ${
            isFullStack
                ? `const response = await fetch(\`\${getApiDomain()}/api/tenants\`);`
                : `const response = await fetch(\`\${getApiDomain()}/tenants\`);`
        }
        if (!response.ok) {
            throw new Error(\`Failed to fetch tenants: \${response.statusText}\`);
        }
        const responseData = await response.json();
        if (responseData && responseData.status === "OK" && Array.isArray(responseData.tenants)) {
            return responseData.tenants as Tenant[];
        } else if (Array.isArray(responseData)) {
             return responseData as Tenant[];
        }
        console.error("Unexpected response format from /tenants:", responseData);
        throw new Error("Failed to parse tenants data from server.");
    } catch (error) {
        console.error("Error fetching tenants:", error);
        return [];
    }
};

const TenantSwitcherFooter = () => {
    const [currentTenantId, setCurrentTenantId] = useState<string>("public");
    const [showTenantSwitcher, setShowTenantSwitcher] = useState(false);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function setup() {
            setLoading(true);

            const storedTenantId = localStorage.getItem("tenantId");
            if (storedTenantId && storedTenantId !== currentTenantId) {
                setCurrentTenantId(storedTenantId);
            }

            try {
                const loadedTenants = await tenantLoader();
                setTenants(loadedTenants);
            } catch (err) {
                console.error("Error loading tenants:", err);
                setError(err instanceof Error ? err.message : "Failed to load tenants");
            } finally {
                setLoading(false);
            }
        }

        setup();

    }, []);

    const openTenantModal = () => {
        setShowTenantSwitcher(true);
    };

    const closeTenantModal = () => {
        setShowTenantSwitcher(false);
    };

    const selectTenant = (tenantId: string) => {
        localStorage.setItem("tenantId", tenantId);
        setCurrentTenantId(tenantId);
        closeTenantModal();
        window.location.href = "/auth";
    };

    return (
        <>
            <div id="st-tenant-selector-footer">
                <span id="st-current-tenant-display">Current Tenant: {currentTenantId || 'None'}</span>
                <button id="st-switch-tenant-btn" onClick={openTenantModal}>
                    Switch Tenant
                </button>
            </div>
            <div
                id="st-tenant-modal-backdrop"
                onClick={closeTenantModal}
                style={{ display: showTenantSwitcher ? 'flex' : 'none' }}
            >
                <div id="st-tenant-modal" onClick={(e) => e.stopPropagation()}>
                    <button id="st-tenant-modal-close" title="Close" onClick={closeTenantModal}>&times;</button>
                        <h3>Select Tenant</h3>
                        <ul id="st-tenant-list">
                            {loading ? (
                                <li>Loading tenants...</li>
                            ) : error ? (
                                <li>{error}</li>
                            ) : tenants.length === 0 ? (
                                <li>No tenants available or failed to load.</li>
                            ) : (
                                tenants.map((tenant) => (
                                    <li
                                        key={tenant.tenantId}
                                        data-tenant-id={tenant.tenantId}
                                        onClick={() => selectTenant(tenant.tenantId)}
                                    >
                                        {tenant.tenantId}
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
        </>
    );
};

`
        : ""
}

export const ComponentWrapper = (props: { children: JSX.Element }): JSX.Element => {
    let childrenToRender = props.children;

    ${
        recipes.includes("passwordless") &&
        (configType === "passwordless" ||
            configType === "thirdpartypasswordless" ||
            configType === "all_auth" ||
            configType === "multitenancy" ||
            userArguments?.secondfactors?.some(
                (factor) => factor.includes("email") || factor.includes("phone") || factor.includes("link")
            ))
            ? `childrenToRender = (
        <PasswordlessComponentsOverrideProvider
            components={{
                PasswordlessUserInputCodeFormFooter_Override: ({ DefaultComponent, ...cProps }) => {
                    const loginAttemptInfo = cProps.loginAttemptInfo;
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
                            <DefaultComponent {...cProps} />
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
            : ``
    }
    ${
        configType === "multitenancy"
            ? `return (
        <>
            {childrenToRender}
            <TenantSwitcherFooter />
        </>
    );`
            : `return childrenToRender;`
    }
}`;

    return template;
};

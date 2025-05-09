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
    thirdParty: (providers: OAuthProvider[]) => {
        const providerInitMap: Record<string, string> = {
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
    passwordless: (userArguments?: UserFlags) => {
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
    session: (hasMFA: boolean = false) => {
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
    multiFactorAuth: (firstFactors?: string[], secondFactors?: string[]) => {
        const availableFirstFactors: string[] = [];

        if (firstFactors) {
            if (firstFactors.includes("emailpassword")) {
                availableFirstFactors.push("emailpassword");
            }
            if (firstFactors.includes("thirdparty")) {
                availableFirstFactors.push("thirdparty");
            }
            const hasPasswordless = firstFactors.some((f: string) => f.startsWith("link-") || f.startsWith("otp-"));
            if (hasPasswordless) {
                availableFirstFactors.push("passwordless");
            }
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
};

export const reactPreBuiltUIs = {
    emailPassword: "EmailPasswordPreBuiltUI",
    thirdParty: "ThirdPartyPreBuiltUI",
    passwordless: "PasswordlessPreBuiltUI",
    multiFactorAuth: "MultiFactorAuthPreBuiltUI",
    emailVerification: "EmailVerificationPreBuiltUI",
    totp: "TOTPPreBuiltUI",
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

    // For multitenancy, include ALL potential first/second factor recipes and UIs
    if (configType === "multitenancy") {
        recipes.push("multitenancy");

        // Add all possible login/MFA recipes and UIs
        const allPossibleUIRecipes = [
            "emailPassword",
            "thirdParty",
            "passwordless",
            "multiFactorAuth",
            "emailVerification",
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

    // Always add session
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
        additionalImports.push('import { GetRedirectionURLContext } from "supertokens-auth-react/lib/build/types";');
    }

    const recipeInits = recipes
        .map((recipe: string) => {
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

    const template = `${imports}
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
    getRedirectionURL: async (context: GetRedirectionURLContext) => {
        // Default redirection logic, can be customized further if needed per recipe
        if (context.action === "SUCCESS") {
            // newSessionCreated is not always present on GetRedirectionURLContext,
            // but it's a common check.
            // For more specific checks, you might need to cast context based on recipeId
            // or check context.newSessionCreated explicitly if (context as any).newSessionCreated
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
    emailPasswordEnabled?: boolean;
    thirdPartyEnabled?: boolean;
    passwordlessEnabled?: boolean;
}

const tenantLoader = async (): Promise<Tenant[]> => {
    try {
        const response = await fetch(\`\${getApiDomain()}/tenants\`);
        if (!response.ok) {
            throw new Error(\`Failed to fetch tenants: \${response.statusText}\`);
        }
        const responseData = await response.json();
        // Ensure the response structure matches what the backend sends
        if (responseData && responseData.status === "OK" && Array.isArray(responseData.tenants)) {
            return responseData.tenants as Tenant[];
        } else if (Array.isArray(responseData)) { // Fallback if backend sends array directly
             return responseData as Tenant[];
        }
        console.error("Unexpected response format from /tenants:", responseData);
        throw new Error("Failed to parse tenants data from server.");
    } catch (error) {
        console.error("Error fetching tenants:", error);
        return []; // Return empty array on error
    }
};

// TenantSelector component will be defined after TenantSwitcherFooter
// to ensure TenantSwitcherFooter can reference it if needed (though not in this exact new design)

const TenantSwitcherFooter = () => {
    const [currentTenantId, setCurrentTenantId] = useState<string | null>(null);
    const [showTenantSwitcher, setShowTenantSwitcher] = useState(false);

    useEffect(() => {
        async function initTenants() {
            const storedTenantId = localStorage.getItem("tenantId");
            if (storedTenantId) {
                setCurrentTenantId(storedTenantId);
            } else {
                // If no tenantId in localStorage, try to load and set the first one
                const tenants = await tenantLoader();
                if (tenants.length > 0) {
                    const firstTenantId = tenants[0].tenantId;
                    setCurrentTenantId(firstTenantId);
                    localStorage.setItem("tenantId", firstTenantId);
                    // Dispatch a custom event to notify other parts of the app if necessary
                    window.dispatchEvent(new CustomEvent("tenantChanged"));
                } else {
                    setCurrentTenantId(null); // No tenants available
                }
            }
        }
        initTenants();

        // Listen for direct localStorage changes from other tabs/windows
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "tenantId") {
                setCurrentTenantId(event.newValue);
            }
        };
        window.addEventListener("storage", handleStorageChange);

        // Listen for custom event in case tenant is changed programmatically within the same tab
        const handleTenantChangedEvent = () => {
            setCurrentTenantId(localStorage.getItem("tenantId"));
        };
        window.addEventListener("tenantChanged", handleTenantChangedEvent);
        
        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("tenantChanged", handleTenantChangedEvent);
        };
    }, []);

    const handleSwitchTenantClick = () => {
        setShowTenantSwitcher(true); // Show the modal
    };

    const onTenantSelected = (tenantId: string) => {
        localStorage.setItem("tenantId", tenantId);
        setCurrentTenantId(tenantId);
        setShowTenantSwitcher(false); // Hide modal
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent("tenantChanged"));
        // Reload or navigate to ensure SuperTokens SDK picks up the new tenantId for API calls.
        // Navigating to /auth is a common pattern to re-initialize auth flow with new tenant.
        window.location.href = "/auth";
    };

    const closeTenantSelector = () => {
        setShowTenantSwitcher(false);
    }

    return (
        <>
            <div style={{
                padding: "10px",
                textAlign: "center",
                borderTop: "1px solid #eee",
                marginTop: "20px",
                backgroundColor: "#f9f9f9",
                fontSize: "14px",
            }}>
                {currentTenantId ? (
                    <span>Current Tenant: <strong>{currentTenantId}</strong> | </span>
                ) : (
                    <span>No tenant selected | </span>
                )}
                <button
                    onClick={handleSwitchTenantClick}
                    style={{
                        background: "none",
                        border: "none",
                        color: "var(--palette-textLink, #4949e4)",
                        textDecoration: "underline",
                        cursor: "pointer",
                        fontSize: "inherit"
                    }}>
                    {currentTenantId ? "Switch Tenant" : "Select Tenant"}
                </button>
            </div>
            {showTenantSwitcher && (
                <div
                    onClick={closeTenantSelector} // Click on overlay closes it
                    style={{
                        position: "fixed", // Changed to fixed for full screen overlay
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)", // Darker overlay
                        zIndex: 1000, // Ensure it's on top
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    {/* Stop propagation to prevent overlay click when clicking inside selector */}
                    <div onClick={(e) => e.stopPropagation()}>
                        <TenantSelector onTenantSelected={onTenantSelected} />
                    </div>
                </div>
            )}
        </>
    );
};

function TenantSelector({ onTenantSelected }: { onTenantSelected: (tenantId: string) => void }) {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTenants() {
            setLoading(true);
            try {
                const loadedTenants = await tenantLoader();
                setTenants(loadedTenants);
            } catch (err: unknown) {
                console.error("Error fetching tenants in selector:", err);
                setError(err instanceof Error ? err.message : "Failed to load tenants");
            } finally {
                setLoading(false);
            }
        }
        fetchTenants();
    }, []);

    if (loading) {
        return <div className="tenant-selector-container tenant-loading">Loading tenants...</div>;
    }

    if (error) {
        return <div className="tenant-selector-container tenant-error"><p>{error}</p></div>;
    }

    if (tenants.length === 0) {
        return <div className="tenant-selector-container tenant-empty"><p>No tenants available.</p></div>;
    }

    return (
        <div className="tenant-selector-container">
            <h2>Select a Tenant</h2>
            <div className="tenant-list">
                {tenants.map((tenant) => (
                    <button
                        key={tenant.tenantId}
                        onClick={() => onTenantSelected(tenant.tenantId)}
                        className="tenant-button">
                        {tenant.tenantId}
                        <div className="tenant-features">
                            {tenant.emailPasswordEnabled && <span className="tenant-feature">Email/Password</span>}
                            {tenant.thirdPartyEnabled && <span className="tenant-feature">Social Login</span>}
                            {tenant.passwordlessEnabled && <span className="tenant-feature">Passwordless</span>}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
`
        : ""
}

export const ComponentWrapper = (props: { children: JSX.Element }): JSX.Element => {
    let childrenToRender = props.children;

    ${
        // Logic for P<ctrl61>asswordlessComponentsOverrideProvider
        recipes.includes("passwordless") &&
        (configType === "passwordless" ||
            configType === "thirdpartypasswordless" ||
            configType === "all_auth" ||
            configType === "multitenancy" || // Multitenancy might also use passwordless
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
            : `` // No specific override if not passwordless context demanding it
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
};`;
    return template;
};

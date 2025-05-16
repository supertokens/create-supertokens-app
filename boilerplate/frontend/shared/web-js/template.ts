import { type ConfigType } from "../../../../lib/ts/templateBuilder/types.js";
import { configToRecipes } from "../../../../lib/ts/templateBuilder/constants.js";
import { getAppInfo } from "../../../shared/config/appInfo.js";
import { UserFlags } from "../../../../lib/ts/types.js";
import { type OAuthProvider } from "../../../../lib/ts/templateBuilder/types.js";
import { thirdPartyLoginProviders } from "../../../backend/shared/config/oAuthProviders.js";

interface WebJSTemplate {
    configType: ConfigType;
    userArguments?: UserFlags;
    isFullStack?: boolean;
}

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

export const uiRecipeInits = {
    emailPassword: () => `(window as any).supertokensUIEmailPassword.init()`,
    thirdParty: (providers: OAuthProvider[]) => {
        const providerInitMap: Record<string, string> = {
            google: "(window as any).supertokensUIThirdParty.Google.init()",
            github: "(window as any).supertokensUIThirdParty.Github.init()",
            apple: "(window as any).supertokensUIThirdParty.Apple.init()",
            twitter: "(window as any).supertokensUIThirdParty.Twitter.init()",
        };

        const providerInits = providers
            .map((p) => providerInitMap[p.id])
            .filter(Boolean)
            .join(",\n                        ");

        return `(window as any).supertokensUIThirdParty.init({
                signInAndUpFeature: {
                    providers: [
                        ${providerInits}
                    ],
                },
            })`;
    },
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
        const firstFactorsStr = firstFactors
            ? firstFactors.map((f) => `"${f}"`).join(", ")
            : `"thirdparty", "emailpassword"`;

        if (secondFactors && secondFactors.length > 0) {
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
                getRequiredSecondaryFactorsForUser: async () => {
                    return [${factorIds.join(", ")}];
                },
            }),
        }
    })`;
            }
        }

        return `(window as any).supertokensUIMultiFactorAuth.init({
        firstFactors: [${firstFactorsStr}]
    })`;
    },
    emailVerification: (hasMFA?: boolean) => `(window as any).supertokensUIEmailVerification.init({
        mode: ${hasMFA ? '"OPTIONAL"' : '"REQUIRED"'}
    })`,
    totp: () => `(window as any).supertokensUITOTP.init()`,
    multitenancy: () => `(window as any).supertokensUIMultitenancy.init({
        override: {
            functions: (oI: any) => {
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

export const generateWebJSTemplate = ({ configType, isFullStack, userArguments }: WebJSTemplate): string => {
    const recipesSet = new Set<string>(["session"]);

    if (userArguments?.firstfactors || userArguments?.secondfactors) {
        const factors = [...(userArguments.firstfactors || []), ...(userArguments.secondfactors || [])];
        if (factors.includes("emailpassword")) recipesSet.add("emailPassword");
        if (factors.includes("thirdparty")) recipesSet.add("thirdParty");
        if (factors.some((f: string) => f.startsWith("otp-") || f.startsWith("link-"))) recipesSet.add("passwordless");
        if (userArguments.secondfactors && userArguments.secondfactors.length > 0) recipesSet.add("multiFactorAuth");
        if (userArguments.secondfactors?.includes("totp")) recipesSet.add("totp");
        if (userArguments.secondfactors?.some((f: string) => f.includes("email"))) recipesSet.add("emailVerification");
        if (configType === "multitenancy") recipesSet.add("multitenancy");
    } else {
        configToRecipes[configType]?.forEach((recipe: string) => {
            if (recipe !== "multiFactorAuth" && recipe !== "totp") {
                recipesSet.add(recipe);
            }
        });
        if (configType === "multitenancy") {
            recipesSet.add("multitenancy");
        }
    }

    const recipes = [...recipesSet].filter((recipe) =>
        frontendRecipes.includes(recipe as typeof frontendRecipes[number])
    );

    const hasMFA =
        (userArguments?.secondfactors && userArguments.secondfactors.length > 0) || recipes.includes("multiFactorAuth");

    if (hasMFA && !recipes.includes("multiFactorAuth")) {
        recipes.push("multiFactorAuth");
    }

    const needsTOTP = hasMFA && userArguments?.secondfactors?.includes("totp") && !recipes.includes("totp");

    if (needsTOTP) {
        recipes.push("totp");
    }

    const needsEmailVerification =
        hasMFA &&
        userArguments?.secondfactors?.some((factor: string) => factor.includes("email")) &&
        !recipes.includes("emailVerification");

    if (needsEmailVerification) {
        recipes.push("emailVerification");
    }

    const appInfo = getAppInfo(isFullStack);

    let imports = `import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";`;

    if (hasMFA) {
        imports = `import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";
import EmailVerification from "supertokens-web-js/recipe/emailverification";
import MultiFactorAuth from "supertokens-web-js/recipe/multifactorauth";`;
    }
    if (configType === "multitenancy" && !imports.includes("Multitenancy from")) {
        if (imports.includes("MultiFactorAuth from")) {
            imports += `\nimport Multitenancy from "supertokens-web-js/recipe/multitenancy";`;
        } else if (imports.includes("Session from")) {
            imports += `\nimport Multitenancy from "supertokens-web-js/recipe/multitenancy";`;
        } else {
            imports += `\nimport Session from "supertokens-web-js/recipe/session";\nimport Multitenancy from "supertokens-web-js/recipe/multitenancy";`;
        }
    }

    const coreRecipeInits = ["Session.init()"];
    if (configType === "multitenancy") {
        coreRecipeInits.push(`Multitenancy.init({
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
            })`);
    }
    if (hasMFA) {
        coreRecipeInits.push("EmailVerification.init()");
        coreRecipeInits.push("MultiFactorAuth.init()");
    }

    const initSuperTokensWebJSCode = `SuperTokens.init({
        appInfo: {
            appName: "${appInfo.appName}",
            apiDomain: getApiDomain(),
            apiBasePath: "${appInfo.apiBasePath}",
        },
        recipeList: [
            ${coreRecipeInits.join(",\n            ")}
        ]
    });`;

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

    const uiInitStrings = recipes
        .map((recipe: string) => {
            if (recipe === "multiFactorAuth") {
                return uiRecipeInits.multiFactorAuth(userArguments?.firstfactors, userArguments?.secondfactors);
            }
            if (recipe === "passwordless") {
                return uiRecipeInits.passwordless(userArguments);
            }
            if (recipe === "emailVerification") {
                return uiRecipeInits.emailVerification(hasMFA ?? false);
            }
            if (recipe === "thirdParty") {
                const providersToUse = userArguments?.providers
                    ? thirdPartyLoginProviders.filter((p: OAuthProvider) => userArguments.providers!.includes(p.id))
                    : thirdPartyLoginProviders;
                return uiRecipeInits.thirdParty(providersToUse);
            }

            const initFunc = uiRecipeInits[recipe as keyof typeof uiRecipeInits];
            if (typeof initFunc === "function") {
                if (recipe !== "passwordless" && recipe !== "multiFactorAuth" && recipe !== "thirdParty") {
                    return (initFunc as any)();
                }
            }
            console.warn("Skipping UI init for recipe (or init func not found/callable): " + recipe);
            return null;
        })
        .filter(Boolean);

    if (hasMFA) {
        if (needsTOTP && !uiInitStrings.some((init) => init.includes("TOTP"))) {
            uiInitStrings.push(uiRecipeInits.totp());
        }
    }

    const isMultitenancyInternal = configType === "multitenancy";
    if (isMultitenancyInternal && !uiInitStrings.some((init) => init.includes("Multitenancy"))) {
        uiInitStrings.push(uiRecipeInits.multitenancy());
    }

    return `

${imports}

const isMultitenancy = ${isMultitenancyInternal};
${getApiDomainFunc}
${getWebsiteDomainFunc}

export function initSuperTokensUI() {
    (window as any).supertokensUIInit("supertokensui", {
        appInfo: {
            websiteDomain: getWebsiteDomain(),
            apiDomain: getApiDomain(),
            appName: "${appInfo.appName}",
            websiteBasePath: "${appInfo.websiteBasePath}",
            apiBasePath: "${appInfo.apiBasePath}",
        },
        ${configType === "multitenancy" ? `usesDynamicLoginMethods: true,` : ""}
        recipeList: [
            ${uiInitStrings.join(",\n            ")}
        ],
    });
}

export function initSuperTokensWebJS() {
    ${initSuperTokensWebJSCode}

    if (isMultitenancy) {
        initTenantSelectorInterface();
    }
}

${
    isMultitenancyInternal
        ? `
export async function initTenantSelectorInterface() {
    const ST_TENANT_ID_KEY = "tenantId";
    let currentTenantId = localStorage.getItem(ST_TENANT_ID_KEY) || 'public';
    let tenants: any[] = [];

    function waitForElm(selector: any) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    async function tenantLoader() {
        try {
            ${
                isFullStack
                    ? `const response = await fetch(\`\${getApiDomain()}/api/tenants\`);`
                    : `const response = await fetch(\`\${getApiDomain()}/tenants\`);`
            }
            if (!response.ok) {
                console.error(\`Failed to fetch tenants: \${response.statusText}\`);
                return [];
            }
            const responseData = await response.json();
            if (responseData && responseData.status === "OK" && Array.isArray(responseData.tenants)) {
                return responseData.tenants;
            } else if (Array.isArray(responseData)) {
                return responseData;
            }
            console.error("Unexpected response format from /tenants:", responseData);
            return [];
        } catch (error) {
            console.error("Error fetching tenants:", error);
            return [];
        }
    }

    function initTenantSelectorDOM(existingFooterElement: any) {
        if (document.getElementById("st-tenant-selector-footer")) {
            return; 
        }

        const footerDiv = document.createElement("div");
        footerDiv.id = "st-tenant-selector-footer";
        footerDiv.innerHTML = \`
            <span id="st-current-tenant-display">Current Tenant: Loading...</span>
            <button id="st-switch-tenant-btn">Switch Tenant</button>
        \`;
        
        if (existingFooterElement && existingFooterElement.parentElement) {
            existingFooterElement.parentElement.insertBefore(footerDiv, existingFooterElement);
        } else {
            document.body.appendChild(footerDiv);
        }

        const modalBackdrop = document.createElement("div");
        modalBackdrop.id = "st-tenant-modal-backdrop";
        modalBackdrop.innerHTML = \`
            <div id="st-tenant-modal">
                <button id="st-tenant-modal-close" title="Close">&times;</button>
                <h3>Select Tenant</h3>
                <ul id="st-tenant-list"></ul>
            </div>
        \`;
        document.body.appendChild(modalBackdrop);

        document.getElementById("st-switch-tenant-btn")?.addEventListener("click", openTenantModal);
        document.getElementById("st-tenant-modal-close")?.addEventListener("click", closeTenantModal);
        modalBackdrop.addEventListener("click", function(event) {
            if (event.target === modalBackdrop) {
                closeTenantModal();
            }
        });
    }

    function updateTenantDisplay() {
        const displayEl = document.getElementById("st-current-tenant-display");
        if (displayEl) {
            displayEl.textContent = \`Current Tenant: \${currentTenantId || 'None'}\`;
        }
    }

    function populateTenantList() {
        const listEl = document.getElementById("st-tenant-list");
        if (!listEl) return;
        listEl.innerHTML = "";

        if (tenants.length === 0) {
            listEl.innerHTML = "<li>No tenants available or failed to load.</li>";
            return;
        }

        tenants.forEach(tenant => {
            const listItem = document.createElement("li");
            listItem.textContent = tenant.tenantId;
            listItem.dataset.tenantId = tenant.tenantId;
            listItem.addEventListener("click", () => selectTenant(tenant.tenantId));
            listEl.appendChild(listItem);
        });
    }

    function openTenantModal() {
        populateTenantList();
        const modalBackdrop = document.getElementById("st-tenant-modal-backdrop");
        if (modalBackdrop) modalBackdrop.style.display = "flex";
    }

    function closeTenantModal() {
        const modalBackdrop = document.getElementById("st-tenant-modal-backdrop");
        if (modalBackdrop) modalBackdrop.style.display = "none";
    }

    async function selectTenant(tenantId: any) {
        localStorage.setItem(ST_TENANT_ID_KEY, tenantId);
        currentTenantId = tenantId;
        updateTenantDisplay();
        closeTenantModal();
        window.dispatchEvent(new CustomEvent("tenantChanged", { detail: { tenantId } }));
        window.location.href = "/auth"; 
    }

    async function setup() {
        tenants = await tenantLoader();
        if (!currentTenantId && tenants.length > 0) {
            currentTenantId = tenants[0].tenantId;
            localStorage.setItem(ST_TENANT_ID_KEY, currentTenantId);
        }
        
        const commonFooterSelectors = [
            'footer'
        ];
        let footerInjected = false;
        for (const selector of commonFooterSelectors) {
            try {
                const elm = await waitForElm(selector);
                if (elm) {
                    initTenantSelectorDOM(elm);
                    footerInjected = true;
                    break;
                }
            } catch (e) {
                // Element not found by this selector, or observer timed out (if implemented)
                // console.warn(\`Footer selector "\${selector}" not found or timed out.\`);
            }
        }
        if (!footerInjected) {
            initTenantSelectorDOM(null); // Fallback to appending to body
        }
        
        updateTenantDisplay(); // Update display after DOM is potentially ready and tenantId is set

        window.addEventListener("storage", (event) => {
            if (event.key === ST_TENANT_ID_KEY) {
                currentTenantId = event.newValue as string;
                updateTenantDisplay();
            }
        });
        window.addEventListener("tenantChanged", () => {
            currentTenantId = localStorage.getItem(ST_TENANT_ID_KEY) as string;
            updateTenantDisplay();
        });
    }
    
    // Ensure DOM is ready before trying to run setup which might interact with DOM
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", setup);
    } else {
        setup();
    }
}
`
        : "export async function initTenantSelectorInterface() { /* STUB, to prevent linters complaining */ };"
};`;
};

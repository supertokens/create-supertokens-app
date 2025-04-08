import { type OAuthProvider, type ConfigType } from "../../../../lib/ts/templateBuilder/types";
import { configToRecipes } from "../../../../lib/ts/templateBuilder/constants";
import { config } from "../../../shared/config/base";
import { getAppInfo } from "../../../shared/config/appInfo";
import { oAuthProviders } from "../../../backend/shared/config/oAuthProviders";
import { UserFlags } from "../../../../lib/ts/types";

interface PythonTemplate {
    configType: ConfigType;
    userArguments?: UserFlags;
    framework?: string; // Added framework parameter
}

export const pyRecipeImports = {
    emailPassword: "from supertokens_python.recipe import emailpassword",
    thirdParty:
        "from supertokens_python.recipe import thirdparty\nfrom supertokens_python.recipe.thirdparty.provider import ProviderInput, ProviderConfig, ProviderClientConfig",
    passwordless: "from supertokens_python.recipe import passwordless",
    session: "from supertokens_python.recipe import session",
    dashboard: "from supertokens_python.recipe import dashboard",
    userRoles: "from supertokens_python.recipe import userroles",
    multiFactorAuth: "from supertokens_python.recipe import multifactorauth",
    accountLinking: "from supertokens_python.recipe import accountlinking",
    emailVerification: "from supertokens_python.recipe import emailverification",
    totp: "from supertokens_python.recipe import totp",
    multitenancy: "from supertokens_python.recipe import multitenancy",
} as const;

// Get appInfo object once to use its defaults in the template string
const app_info_object = getAppInfo();

export const pyBaseTemplate = `
from supertokens_python import init, InputAppInfo, SupertokensConfig
import os

# appInfo object is defined outside this template string

def get_api_domain() -> str:
    # Use appInfo defaults directly in the generated Python code
    api_port = str(${app_info_object.defaultApiPort}) # Value injected from template script
    api_url = f"http://localhost:{api_port}"
    return api_url

def get_website_domain() -> str:
    # Use appInfo defaults directly in the generated Python code
    website_port = str(${app_info_object.defaultWebsitePort}) # Value injected from template script
    website_url = f"http://localhost:{website_port}"
    return website_url

# SuperTokens core configuration
supertokens_config = SupertokensConfig(
    connection_uri="${config.connectionURI}"
)

# App configuration
app_info = InputAppInfo(
    app_name="${getAppInfo().appName}",
    api_domain=get_api_domain(),
    website_domain=get_website_domain(),
    api_base_path="/auth",
    website_base_path="/auth"
)

# Recipe list configuration
recipe_list = [
    %RECIPE_LIST%
]

# Initialize SuperTokens with all recipes
init(
    supertokens_config=supertokens_config,
    app_info=app_info,
    framework="%FRAMEWORK%", # Placeholder for dynamic framework
    recipe_list=recipe_list,
    mode="%MODE%", # Placeholder for dynamic mode
    telemetry=False
)
`;

export const pyRecipeInits = {
    emailPassword: () => `emailpassword.init()`,
    thirdParty: (providers: OAuthProvider[]) => `thirdparty.init(
        sign_in_and_up_feature=thirdparty.SignInAndUpFeature(
            providers=[
                ${providers
                    .map(
                        (provider) => `ProviderInput(
                    config=ProviderConfig(
                        third_party_id="${provider.id}",
                        clients=[
                            ProviderClientConfig(
                                client_id="${provider.clientId}",
                                # IMPORTANT: Override this with your client secret in production. Use environment variables.
                                client_secret="${provider.clientSecret}"${
                            provider.additionalConfig
                                ? `,
                                additional_config=${JSON.stringify(provider.additionalConfig, null, 16)}`
                                : ""
                        }
                            )
                        ]
                    )
                )`
                    )
                    .join(",\n                ")}
            ]
        )
    )`,
    passwordless: (userArguments?: UserFlags) => {
        // Determine contact method and flow type based on user arguments
        let contactConfig = "ContactEmailConfig()";
        let flowType = "USER_INPUT_CODE_AND_MAGIC_LINK";

        const hasLinkEmail =
            userArguments?.firstfactors?.includes("link-email") || userArguments?.secondfactors?.includes("link-email");
        const hasLinkPhone =
            userArguments?.firstfactors?.includes("link-phone") || userArguments?.secondfactors?.includes("link-phone");
        const hasOtpEmail =
            userArguments?.firstfactors?.includes("otp-email") || userArguments?.secondfactors?.includes("otp-email");
        const hasOtpPhone =
            userArguments?.firstfactors?.includes("otp-phone") || userArguments?.secondfactors?.includes("otp-phone");

        // Determine contact config
        if ((hasLinkEmail || hasOtpEmail) && (hasLinkPhone || hasOtpPhone)) {
            contactConfig = "ContactEmailOrPhoneConfig()";
        } else if (hasLinkPhone || hasOtpPhone) {
            contactConfig = "ContactPhoneConfig()";
        } else {
            contactConfig = "ContactEmailConfig()";
        }

        // Determine flow type
        const hasLinkFactors = hasLinkEmail || hasLinkPhone;
        const hasOtpFactors = hasOtpEmail || hasOtpPhone;

        if (hasLinkFactors && hasOtpFactors) {
            flowType = "USER_INPUT_CODE_AND_MAGIC_LINK";
        } else if (hasLinkFactors) {
            flowType = "MAGIC_LINK";
        } else if (hasOtpFactors) {
            flowType = "USER_INPUT_CODE";
        }

        return `passwordless.init(
        flow_type="${flowType}",
        contact_config=${contactConfig}
    )`;
    },
    session: () => `session.init()`,
    dashboard: () => `dashboard.init()`,
    userRoles: () => `userroles.init()`,
    multiFactorAuth: (firstFactors?: string[], secondFactors?: string[]) => {
        const firstFactorsStr =
            firstFactors?.map((factor) => `"${factor}"`).join(", ") || `"emailpassword", "thirdparty"`;

        // Basic initialization with/without second factors
        if (secondFactors && secondFactors.length > 0) {
            return `multifactorauth.init(
        first_factors=[${firstFactorsStr}],
        override=multifactorauth.OverrideConfig(
            functions=lambda original_implementation:
                override_multifactor_functions(original_implementation)
        )
    )`;
        } else {
            return `multifactorauth.init(
        first_factors=[${firstFactorsStr}]
    )`;
        }
    },
    accountLinking: () => `accountlinking.init(
        # Pass the reference to the async function defined elsewhere (e.g., in DRF boilerplate)
        should_do_automatic_account_linking=async_should_do_linking
    )`,
    emailVerification: () => `emailverification.init(
        mode="REQUIRED"
    )`,
    totp: () => `totp.init()`,
    multitenancy: () => `multitenancy.init(
        override=multitenancy.OverrideConfig(
            functions=lambda original_implementation: original_implementation
            # Add any necessary overrides for Multitenancy + MFA interaction here
            # For example, you might need to customize tenant-specific MFA requirements
        )
    )`,
} as const;

export const generatePythonTemplate = ({ configType, userArguments, framework }: PythonTemplate): string => {
    // Determine recipes based on userArguments first, then fall back to configType
    const recipesSet = new Set<string>(["session", "dashboard", "userRoles"]); // Start with common recipes

    if (userArguments?.firstfactors || userArguments?.secondfactors) {
        const factors = [...(userArguments.firstfactors || []), ...(userArguments.secondfactors || [])];
        if (factors.includes("emailpassword")) recipesSet.add("emailPassword");
        if (factors.includes("thirdparty")) recipesSet.add("thirdParty");
        if (factors.some((f) => f.startsWith("otp-") || f.startsWith("link-"))) recipesSet.add("passwordless");
        // MFA recipes will be added later based on hasMFA check
    } else {
        // Fallback to configType if no factors provided
        configToRecipes[configType]?.forEach((recipe) => recipesSet.add(recipe));
    }

    // Convert Set to Array for subsequent logic
    const recipes = [...recipesSet];

    // Check if we need to include MFA based on user arguments OR configType
    const hasMFA =
        configType === "multifactorauth" || (userArguments?.secondfactors && userArguments.secondfactors.length > 0);

    // If we have secondfactors but multifactorauth is not in recipes, add it
    if (hasMFA && !recipes.includes("multiFactorAuth")) {
        recipes.push("multiFactorAuth");
    }

    // If we're using MFA, ensure TOTP is included if it's a second factor
    const needsTOTP = hasMFA && userArguments?.secondfactors?.includes("totp") && !recipes.includes("totp");

    if (needsTOTP) {
        recipes.push("totp");
    }

    // If we have MFA, we generally need EmailVerification and AccountLinking
    if (hasMFA && !recipes.includes("emailVerification")) {
        recipes.push("emailVerification");
    }
    if (hasMFA && !recipes.includes("accountLinking")) {
        recipes.push("accountLinking");
    }

    // Add recipe-specific imports
    let imports = recipes
        .map((recipe) => pyRecipeImports[recipe as keyof typeof pyRecipeImports])
        .filter(Boolean)
        .join("\n");

    // Add additional imports for passwordless contact configuration
    if (recipes.includes("passwordless")) {
        const hasLinkEmail =
            userArguments?.firstfactors?.includes("link-email") || userArguments?.secondfactors?.includes("link-email");
        const hasLinkPhone =
            userArguments?.firstfactors?.includes("link-phone") || userArguments?.secondfactors?.includes("link-phone");
        const hasOtpEmail =
            userArguments?.firstfactors?.includes("otp-email") || userArguments?.secondfactors?.includes("otp-email");
        const hasOtpPhone =
            userArguments?.firstfactors?.includes("otp-phone") || userArguments?.secondfactors?.includes("otp-phone");

        if ((hasLinkEmail || hasOtpEmail) && (hasLinkPhone || hasOtpPhone)) {
            imports += "\nfrom supertokens_python.recipe.passwordless import ContactEmailOrPhoneConfig";
        } else if (hasLinkPhone || hasOtpPhone) {
            imports += "\nfrom supertokens_python.recipe.passwordless import ContactPhoneConfig";
        } else {
            imports += "\nfrom supertokens_python.recipe.passwordless import ContactEmailConfig";
        }
    }

    // Add imports for types used in overrides
    let typingImports = new Set<string>();
    if (recipes.includes("accountLinking")) {
        imports += `
from supertokens_python.recipe.accountlinking.types import AccountInfoWithRecipeIdAndUserId, ShouldAutomaticallyLink, ShouldNotAutomaticallyLink
from supertokens_python.recipe.session.interfaces import SessionContainer
from supertokens_python.types import User`;
        typingImports.add("Optional");
        typingImports.add("Dict");
        typingImports.add("Any");
        typingImports.add("Union");
    }

    if (hasMFA && userArguments?.secondfactors && userArguments.secondfactors.length > 0) {
        imports += `
from supertokens_python.recipe.multifactorauth.interfaces import RecipeInterface as MFARecipeInterface
from supertokens_python.recipe.multifactorauth.types import MFARequirementList, FactorIds`;
        typingImports.add("Callable");
        typingImports.add("Awaitable");
        typingImports.add("List");
        // Ensure Dict and Any are included if not added by account linking
        typingImports.add("Dict");
        typingImports.add("Any");
    }

    if (typingImports.size > 0) {
        imports += `\nfrom typing import ${[...typingImports].join(", ")}`;
    }

    // Add MFA override function definition if needed
    if (hasMFA && userArguments?.secondfactors && userArguments.secondfactors.length > 0) {
        imports += `

def override_multifactor_functions(original_implementation: MFARecipeInterface):
    """
    This function overrides the default behavior of the MultiFactorAuth recipe.
    It defines custom logic for determining MFA requirements during login/signup
    and which secondary factors a user must have set up.
    """
    async def get_mfa_requirements_for_auth(
        tenant_id: str,
        access_token_payload: dict,
        completed_factors: dict,
        user,
        factors_set_up_for_user,
        required_secondary_factors_for_user,
        required_secondary_factors_for_tenant,
        user_context: dict,
    ) -> MFARequirementList:
        """
        Determines the MFA requirements for a user during sign in / up.
        - Returning an empty list means MFA is not required.
        - Returning a list with FactorIds means one of those factors must be completed.
        - Returning a list of dicts allows for complex requirements (e.g., multiple factors).
        """
        return [
            {
                # Require the user to complete one of the specified second factors
                "oneOf": [
                    ${userArguments.secondfactors
                        .map((factor) => {
                            // Map the factor to the correct FactorIds format
                            const factorMapping: Record<string, string> = {
                                totp: "FactorIds.TOTP",
                                "otp-email": "FactorIds.OTP_EMAIL",
                                "otp-phone": "FactorIds.OTP_PHONE",
                                "link-email": "FactorIds.LINK_EMAIL",
                                "link-phone": "FactorIds.LINK_PHONE",
                                // Underscore format for compatibility
                                otp_email: "FactorIds.OTP_EMAIL",
                                otp_phone: "FactorIds.OTP_PHONE",
                                link_email: "FactorIds.LINK_EMAIL",
                                link_phone: "FactorIds.LINK_PHONE",
                            };
                            return factorMapping[factor] || `"${factor}"`;
                        })
                        .join(", ")}
                ],
            }
        ]

    async def get_required_secondary_factors_for_user(
        tenant_id: str,
        user_id: str,
        user_context: dict,
    ) -> list:
        """
        Determines which secondary factors a user must have setup before they can complete the MFA flow.
        - Returning an empty list means no specific factors need to be set up.
        - Returning a list of FactorIds means the user must have at least one of these factors set up.
        """
        # Return the required secondary factors for the user
        return [${userArguments.secondfactors
            .map((factor) => {
                // Map the factor to the correct FactorIds format
                const factorMapping: Record<string, string> = {
                    totp: "FactorIds.TOTP",
                    "otp-email": "FactorIds.OTP_EMAIL",
                    "otp-phone": "FactorIds.OTP_PHONE",
                    "link-email": "FactorIds.LINK_EMAIL",
                    "link-phone": "FactorIds.LINK_PHONE",
                    // Underscore format for compatibility
                    otp_email: "FactorIds.OTP_EMAIL",
                    otp_phone: "FactorIds.OTP_PHONE",
                    link_email: "FactorIds.LINK_EMAIL",
                    link_phone: "FactorIds.LINK_PHONE",
                };
                return factorMapping[factor] || `"${factor}"`;
            })
            .join(", ")}]

    # Patch the original implementation to use our overridden functions
    original_implementation.get_mfa_requirements_for_auth = get_mfa_requirements_for_auth
    original_implementation.get_required_secondary_factors_for_user = get_required_secondary_factors_for_user
    return original_implementation`;
    }

    // Generate recipe list
    const recipeList = recipes
        .map((recipe) => {
            switch (recipe) {
                case "thirdParty":
                    return pyRecipeInits.thirdParty(oAuthProviders);
                case "multiFactorAuth":
                    return pyRecipeInits.multiFactorAuth(userArguments?.firstfactors, userArguments?.secondfactors);
                case "passwordless":
                    return pyRecipeInits.passwordless(userArguments);
                case "emailPassword":
                case "session":
                case "dashboard":
                case "userRoles":
                case "accountLinking":
                case "emailVerification":
                case "totp":
                case "multitenancy":
                    // These recipes take no arguments
                    const initFunc = pyRecipeInits[recipe];
                    return initFunc(); // Call directly
                default:
                    // Should not happen with current logic, but good practice
                    console.warn(`Unknown recipe encountered in Python template generation: ${recipe}`);
                    return null;
            }
        })
        .filter(Boolean) // Remove any nulls from unknown recipes
        .join(",\n    ");

    // Determine framework and mode for the init call based on the specific framework selected
    let sdkFramework = "fastapi"; // Default
    let sdkMode = "asgi"; // Default

    // The 'framework' variable here comes from the function signature of generatePythonTemplate
    if (framework?.includes("flask")) {
        sdkFramework = "flask";
        sdkMode = "wsgi";
    } else if (framework?.includes("drf")) {
        // Django Rest Framework
        sdkFramework = "django";
        sdkMode = "asgi"; // Django uses ASGI with adapters like uvicorn/daphne
    } else if (framework?.includes("fastapi")) {
        sdkFramework = "fastapi";
        sdkMode = "asgi";
    }

    // Replace placeholders in the base template
    let finalTemplate = pyBaseTemplate.replace("%RECIPE_LIST%", recipeList);
    finalTemplate = finalTemplate.replace("%FRAMEWORK%", sdkFramework);
    finalTemplate = finalTemplate.replace("%MODE%", sdkMode);

    // Define the async function string *only* if accountLinking is included
    const async_linking_func_def = recipes.includes("accountLinking")
        ? `

async def async_should_do_linking(
    new_account_info: AccountInfoWithRecipeIdAndUserId,
    user: Optional[User],
    session: Optional[SessionContainer],
    tenant_id: str,
    user_context: Dict[str, Any],
) -> Union[ShouldNotAutomaticallyLink, ShouldAutomaticallyLink]:
    # Default: Always link without requiring verification (use with caution)
    # TODO: Implement custom logic here. For example, require verification
    # if linking email-based accounts:
    # if new_account_info.recipe_id == "emailpassword" or new_account_info.recipe_id == "passwordless":
    #     return ShouldAutomaticallyLink(should_require_verification=True)

    return ShouldAutomaticallyLink(should_require_verification=False) # Default: link without verification
`
        : ""; // End conditional definition

    // Return the imports, the async linking function definition (if needed), and the processed base template
    return imports + "\n" + async_linking_func_def + "\n\n" + finalTemplate;
};

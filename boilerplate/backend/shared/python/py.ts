import { type OAuthProvider, type ConfigType } from "../../../../lib/ts/templateBuilder/types.js";
import { configToRecipes } from "../../../../lib/ts/templateBuilder/constants.js";
import { config } from "../../../shared/config/base.js";
import { getAppInfo } from "../../../shared/config/appInfo.js";
import { thirdPartyLoginProviders } from "../../../backend/shared/config/oAuthProviders.js";
import { UserFlags } from "../../../../lib/ts/types.js";

interface PythonTemplate {
    configType: ConfigType;
    userArguments?: UserFlags;
    framework?: string;
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

const app_info_object = getAppInfo();

export const pyBaseTemplate = `
from supertokens_python import init, InputAppInfo, SupertokensConfig
import os

def get_api_domain() -> str:
    api_port = str(${app_info_object.defaultApiPort})
    api_url = f"http://localhost:{api_port}"
    return api_url

def get_website_domain() -> str:
    website_port = str(${app_info_object.defaultWebsitePort})
    website_url = f"http://localhost:{website_port}"
    return website_url

supertokens_config = SupertokensConfig(
    connection_uri="${config.connectionURI}"
)

app_info = InputAppInfo(
    app_name="${getAppInfo().appName}",
    api_domain=get_api_domain(),
    website_domain=get_website_domain(),
    api_base_path="/auth",
    website_base_path="/auth"
)

recipe_list = [
    %RECIPE_LIST%
]

init(
    supertokens_config=supertokens_config,
    app_info=app_info,
    framework="%FRAMEWORK%",
    recipe_list=recipe_list,
    mode="%MODE%",
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

        if ((hasLinkEmail || hasOtpEmail) && (hasLinkPhone || hasOtpPhone)) {
            contactConfig = "ContactEmailOrPhoneConfig()";
        } else if (hasLinkPhone || hasOtpPhone) {
            contactConfig = "ContactPhoneConfig()";
        } else {
            contactConfig = "ContactEmailConfig()";
        }

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
        should_do_automatic_account_linking=async_should_do_linking
    )`,
    emailVerification: () => `emailverification.init(
        mode="REQUIRED"
    )`,
    totp: () => `totp.init()`,
    multitenancy: () => `multitenancy.init(
        override=multitenancy.OverrideConfig(
            functions=lambda original_implementation: original_implementation
        )
    )`,
} as const;

export const generatePythonTemplate = ({ configType, userArguments, framework }: PythonTemplate): string => {
    const recipesSet = new Set<string>(["session", "dashboard", "userRoles"]);

    if (userArguments?.firstfactors || userArguments?.secondfactors) {
        const factors = [...(userArguments.firstfactors || []), ...(userArguments.secondfactors || [])];
        if (factors.includes("emailpassword")) recipesSet.add("emailPassword");
        if (factors.includes("thirdparty")) recipesSet.add("thirdParty");
        if (factors.some((f) => f.startsWith("otp-") || f.startsWith("link-"))) recipesSet.add("passwordless");
    } else {
        configToRecipes[configType]?.forEach((recipe: string) => recipesSet.add(recipe));
    }

    const recipes = [...recipesSet];

    const hasMFA =
        configType === "multifactorauth" || (userArguments?.secondfactors && userArguments.secondfactors.length > 0);

    if (hasMFA && !recipes.includes("multiFactorAuth")) {
        recipes.push("multiFactorAuth");
    }

    const needsTOTP = hasMFA && userArguments?.secondfactors?.includes("totp") && !recipes.includes("totp");

    if (needsTOTP) {
        recipes.push("totp");
    }

    if (hasMFA && !recipes.includes("emailVerification")) {
        recipes.push("emailVerification");
    }
    if (hasMFA && !recipes.includes("accountLinking")) {
        recipes.push("accountLinking");
    }

    let imports = recipes
        .map((recipe) => pyRecipeImports[recipe as keyof typeof pyRecipeImports])
        .filter(Boolean)
        .join("\n");

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
        typingImports.add("Dict");
        typingImports.add("Any");
    }

    if (typingImports.size > 0) {
        imports += `\nfrom typing import ${[...typingImports].join(", ")}`;
    }

    if (hasMFA && userArguments?.secondfactors && userArguments.secondfactors.length > 0) {
        imports += `

def override_multifactor_functions(original_implementation: MFARecipeInterface):
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
        return [
            {
                "oneOf": [
                    ${userArguments.secondfactors
                        .map((factor: string) => {
                            const factorMapping: Record<string, string> = {
                                totp: "FactorIds.TOTP",
                                "otp-email": "FactorIds.OTP_EMAIL",
                                "otp-phone": "FactorIds.OTP_PHONE",
                                "link-email": "FactorIds.LINK_EMAIL",
                                "link-phone": "FactorIds.LINK_PHONE",
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
        return [${userArguments.secondfactors
            .map((factor: string) => {
                const factorMapping: Record<string, string> = {
                    totp: "FactorIds.TOTP",
                    "otp-email": "FactorIds.OTP_EMAIL",
                    "otp-phone": "FactorIds.OTP_PHONE",
                    "link-email": "FactorIds.LINK_EMAIL",
                    "link-phone": "FactorIds.LINK_PHONE",
                    otp_email: "FactorIds.OTP_EMAIL",
                    otp_phone: "FactorIds.OTP_PHONE",
                    link_email: "FactorIds.LINK_EMAIL",
                    link_phone: "FactorIds.LINK_PHONE",
                };
                return factorMapping[factor] || `"${factor}"`;
            })
            .join(", ")}]

    original_implementation.get_mfa_requirements_for_auth = get_mfa_requirements_for_auth
    original_implementation.get_required_secondary_factors_for_user = get_required_secondary_factors_for_user
    return original_implementation`;
    }

    const recipeList = recipes
        .map((recipe: string) => {
            switch (recipe) {
                case "thirdParty":
                    const providersToUse = userArguments?.providers
                        ? thirdPartyLoginProviders.filter((p: OAuthProvider) => userArguments.providers!.includes(p.id))
                        : thirdPartyLoginProviders;
                    return pyRecipeInits.thirdParty(providersToUse);
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
                    const initFunc = pyRecipeInits[recipe];
                    return initFunc();
                default:
                    console.warn(`Unknown recipe encountered in Python template generation: ${recipe}`);
                    return null;
            }
        })
        .filter(Boolean)
        .join(",\n    ");

    let sdkFramework = "fastapi";
    let sdkMode = "asgi";

    if (framework?.includes("flask")) {
        sdkFramework = "flask";
        sdkMode = "wsgi";
    } else if (framework?.includes("drf")) {
        sdkFramework = "django";
        sdkMode = "asgi";
    } else if (framework?.includes("fastapi")) {
        sdkFramework = "fastapi";
        sdkMode = "asgi";
    }

    let finalTemplate = pyBaseTemplate.replace("%RECIPE_LIST%", recipeList);
    finalTemplate = finalTemplate.replace("%FRAMEWORK%", sdkFramework);
    finalTemplate = finalTemplate.replace("%MODE%", sdkMode);

    const async_linking_func_def = recipes.includes("accountLinking")
        ? `

async def async_should_do_linking(
    new_account_info: AccountInfoWithRecipeIdAndUserId,
    user: Optional[User],
    session: Optional[SessionContainer],
    tenant_id: str,
    user_context: Dict[str, Any],
) -> Union[ShouldNotAutomaticallyLink, ShouldAutomaticallyLink]:
    return ShouldAutomaticallyLink(should_require_verification=False)
`
        : "";

    return imports + "\n" + async_linking_func_def + "\n\n" + finalTemplate;
};

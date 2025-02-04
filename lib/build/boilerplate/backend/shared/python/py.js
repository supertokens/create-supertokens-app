import { configToRecipes } from "../../../../lib/ts/templateBuilder/constants";
import { config } from "../config/base";
import { appInfo } from "../config/appInfo";
import { oAuthProviders } from "../config/oAuthProviders";
export const pyRecipeImports = {
    emailPassword:
        "from supertokens_python.recipe import emailpassword\nfrom supertokens_python.recipe.emailpassword import InputFormField",
    thirdParty:
        "from supertokens_python.recipe import thirdparty\nfrom supertokens_python.recipe.thirdparty import ProviderInput, ProviderConfig, ProviderClientConfig",
    passwordless:
        "from supertokens_python.recipe import passwordless\nfrom supertokens_python.recipe.passwordless import ContactConfig",
    session: "from supertokens_python.recipe import session",
    dashboard: "from supertokens_python.recipe import dashboard",
    userRoles: "from supertokens_python.recipe import userroles",
    multiFactorAuth: "from supertokens_python.recipe import multifactorauth",
    accountLinking: "from supertokens_python.recipe import accountlinking",
    emailVerification: "from supertokens_python.recipe import emailverification",
    totp: "from supertokens_python.recipe import totp",
};
export const pyBaseTemplate = `
from supertokens_python import init, InputAppInfo, SupertokensConfig
import os

def get_api_domain() -> str:
    api_port = os.environ.get("VITE_APP_API_PORT", "3001")
    api_url = os.environ.get("VITE_APP_API_URL", f"http://localhost:{api_port}")
    return api_url

def get_website_domain() -> str:
    website_port = os.environ.get("VITE_APP_WEBSITE_PORT", "3000")
    website_url = os.environ.get("VITE_APP_WEBSITE_URL", f"http://localhost:{website_port}")
    return website_url

def get_framework_config():
    """Get framework-specific configuration."""
    framework_type = os.environ.get("SUPERTOKENS_FRAMEWORK", "fastapi").lower()
    
    if framework_type == "django":
        return {
            "framework": "django",
            "mode": "wsgi"
        }
    elif framework_type == "flask":
        return {
            "framework": "flask",
            "mode": "wsgi"
        }
    else:  # default to fastapi
        return {
            "framework": "fastapi",
            "mode": "asgi"
        }
`;
export const pyRecipeInits = {
    emailPassword: () => `emailpassword.init(
    sign_up_feature=emailpassword.InputSignUpFeature(
        form_fields=[
            InputFormField(id="email"),
            InputFormField(id="password"),
        ]
    )
)`,
    thirdParty: (providers) => `thirdparty.init(
    sign_in_and_up_feature=thirdparty.SignInAndUpFeature(
        providers=[
            ${(providers || [])
                .map(
                    (p) => `ProviderInput(
                config=ProviderConfig(
                    third_party_id="${p.id}",
                    clients=[
                        ProviderClientConfig(
                            client_id="${p.clientId}",
                            client_secret="${p.clientSecret}"
                        )
                    ]
                )
            )`
                )
                .join(",\n            ")}
        ]
    )
)`,
    passwordless: () => `passwordless.init(
    contact_config=ContactConfig(
        contact_method="EMAIL"
    ),
    flow_type="USER_INPUT_CODE_AND_MAGIC_LINK"
)`,
    session: () => `session.init(
    cookie_same_site="lax",
    cookie_secure=False,
    anti_csrf="NONE"
)`,
    dashboard: () => `dashboard.init(api_key=os.environ.get("DASHBOARD_API_KEY"))`,
    userRoles: () => `userroles.init()`,
    multiFactorAuth: () => `multifactorauth.init(first_factors=["thirdparty", "emailpassword"])`,
    accountLinking: () => `accountlinking.init(
    should_do_automatic_account_linking=lambda: {"shouldAutomaticallyLink": True, "shouldRequireVerification": True}
)`,
    emailVerification: () => `emailverification.init(mode="REQUIRED")`,
    totp: () => `totp.init()`,
};
export const generatePythonTemplate = (configType) => {
    let template = pyBaseTemplate;
    const recipes = configToRecipes[configType];
    // Add recipe-specific imports
    const imports = recipes
        .map((recipe) => pyRecipeImports[recipe])
        .filter(Boolean)
        .join("\n");
    template = imports + "\n" + template;
    // Add configuration
    template += `

# SuperTokens core configuration
supertokens_config = SupertokensConfig(
    connection_uri="${config.connectionURI}"
)

# App configuration
app_info = InputAppInfo(
    app_name="${appInfo.appName}",
    api_domain=get_api_domain(),
    website_domain=get_website_domain(),
    api_base_path="/auth",
    website_base_path="/auth"
)

# Get framework-specific configuration
framework_config = get_framework_config()

# Export framework configuration
framework = framework_config["framework"]
mode = framework_config["mode"]

# Recipe list configuration
recipe_list = [
    ${recipes
        .map((recipe) => {
            if (recipe === "thirdParty") {
                return pyRecipeInits[recipe](oAuthProviders);
            }
            return pyRecipeInits[recipe]();
        })
        .join(",\n    ")}
]

# Initialize SuperTokens with all recipes
init(
    supertokens_config=supertokens_config,
    app_info=app_info,
    framework=framework,
    recipe_list=recipe_list,
    mode=mode,
    telemetry=False
)`;
    return template;
};

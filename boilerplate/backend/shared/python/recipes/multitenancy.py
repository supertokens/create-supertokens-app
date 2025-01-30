from supertokens_python import init
from supertokens_python.recipe import multitenancy, session, dashboard, userroles
from supertokens_python.recipe.multitenancy import (
    TenantConfig,
    EmailPasswordConfig,
    ThirdPartyConfig,
    PasswordlessConfig,
)
from ...config.base import (
    default_supertokens_config,
    default_app_info,
    default_session_config,
    default_cors_config,
    default_rate_limit_config,
    default_oauth_providers,
)

# Multitenancy specific configuration
multitenancy_config = multitenancy.InputConfig(
    default_tenant_id="public",
    email_password_enabled=True,
    third_party_enabled=True,
    passwordless_enabled=True,
    override=multitenancy.InputOverrideConfig(
        functions=multitenancy.RecipeInterface(
            get_tenant=None,  # Use default implementation
            create_tenant=None,  # Use default implementation
            delete_tenant=None,  # Use default implementation
            get_all_tenants=None,  # Use default implementation
            create_or_update_tenant=None,  # Use default implementation
        ),
    ),
)

# Default tenant configuration
default_tenant_config = TenantConfig(
    email_password_config=EmailPasswordConfig(
        enabled=True,
        sign_up_feature=True,
    ),
    third_party_config=ThirdPartyConfig(
        enabled=True,
        providers=list(default_oauth_providers.keys()),
    ),
    passwordless_config=PasswordlessConfig(
        enabled=True,
        contact_method="EMAIL_OR_PHONE",
    ),
    core_config={
        "email_verification_token_lifetime": 7200000,  # 2 hours
        "password_reset_token_lifetime": 3600000,  # 1 hour
    },
)

recipe_list = [
    multitenancy.init(
        override=multitenancy_config.override,
        default_tenant_config=default_tenant_config,
    ),
    session.init(
        cookie_domain=default_session_config.cookie_domain,
        cookie_secure=default_session_config.cookie_secure,
        cookie_same_site=default_session_config.cookie_same_site,
        session_expired_status_code=default_session_config.session_expired_status_code,
        anti_csrf=default_session_config.anti_csrf,
        get_token_transfer_method=default_session_config.get_token_transfer_method,
    ),
    dashboard.init(api_key=os.environ.get("DASHBOARD_API_KEY")),
    userroles.init()
]

# Initialize SuperTokens with all configurations
init(
    supertokens_config=default_supertokens_config,
    app_info=default_app_info,
    framework="fastapi",  # or "flask" depending on the framework
    recipe_list=recipe_list,
    mode="asgi",  # or "wsgi" depending on the framework
    telemetry=False  # Disable telemetry in development
)

# Example of creating a new tenant
async def create_new_tenant(tenant_id: str, connection_uri: str = None):
    """Create a new tenant with custom configuration."""
    tenant_config = TenantConfig(
        email_password_config=EmailPasswordConfig(
            enabled=True,
            sign_up_feature=True,
        ),
        third_party_config=ThirdPartyConfig(
            enabled=True,
            providers=list(default_oauth_providers.keys()),
        ),
        passwordless_config=PasswordlessConfig(
            enabled=True,
            contact_method="EMAIL_OR_PHONE",
        ),
        core_config={
            "email_verification_token_lifetime": 7200000,  # 2 hours
            "password_reset_token_lifetime": 3600000,  # 1 hour
        },
    )
    
    if connection_uri:
        tenant_config.core_config["postgresql_connection_uri"] = connection_uri

    return await multitenancy.create_or_update_tenant(tenant_id, tenant_config) 
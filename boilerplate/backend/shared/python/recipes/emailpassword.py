from supertokens_python import init, InputAppInfo, SupertokensConfig
from supertokens_python.recipe import emailpassword, session, dashboard, userroles
from supertokens_python.recipe.emailpassword import InputFormField
import os

def get_api_domain() -> str:
    api_port = os.environ.get("VITE_APP_API_PORT", "3001")
    api_url = os.environ.get("VITE_APP_API_URL", f"http://localhost:{api_port}")
    return api_url

def get_website_domain() -> str:
    website_port = os.environ.get("VITE_APP_WEBSITE_PORT", "3000")
    website_url = os.environ.get("VITE_APP_WEBSITE_URL", f"http://localhost:{website_port}")
    return website_url

# SuperTokens core configuration
supertokens_config = SupertokensConfig(
    connection_uri="https://try.supertokens.com"
)

# App configuration
app_info = InputAppInfo(
    app_name="SuperTokens Demo App",
    api_domain=get_api_domain(),
    website_domain=get_website_domain(),
    api_base_path="/auth",
    website_base_path="/auth"
)

# Framework configuration
framework = "fastapi"  # or "flask"

# Recipe list configuration
recipe_list = [
    emailpassword.init(
        sign_up_feature=emailpassword.InputSignUpFeature(
            form_fields=[
                InputFormField(id="email"),
                InputFormField(id="password"),
            ]
        ),
    ),
    session.init(
        cookie_same_site="lax",
        cookie_secure=False,
        anti_csrf="NONE"
    ),
    dashboard.init(api_key=os.environ.get("DASHBOARD_API_KEY")),
    userroles.init()
]

# Initialize SuperTokens with EmailPassword recipe
init(
    supertokens_config=supertokens_config,
    app_info=app_info,
    framework=framework,  # or "flask"
    recipe_list=recipe_list,
    mode="asgi",  # or "wsgi"
    telemetry=False
) 

from supertokens_python import init, InputAppInfo, SupertokensConfig
from supertokens_python.recipe import passwordless, session, dashboard, userroles
from supertokens_python.recipe.passwordless import ContactEmailOrPhoneConfig
import os

def get_api_domain() -> str:
    api_port = os.environ.get("VITE_APP_API_PORT", "3001")
    api_url = os.environ.get("VITE_APP_API_URL", f"http://localhost:{api_port}")
    return api_url

def get_website_domain() -> str:
    website_port = os.environ.get("VITE_APP_WEBSITE_PORT", "3000")
    website_url = os.environ.get("VITE_APP_WEBSITE_URL", f"http://localhost:{website_port}")
    return website_url

# Configuration for SuperTokens core and application
supertokens_config = SupertokensConfig(
    connection_uri="https://try.supertokens.com"
)

app_info = InputAppInfo(
    app_name="SuperTokens Demo App",
    api_domain=get_api_domain(),
    website_domain=get_website_domain()
)

framework = None

recipe_list = [
    passwordless.init(
        flow_type="USER_INPUT_CODE_AND_MAGIC_LINK",
        contact_config=ContactEmailOrPhoneConfig()
    ),
    session.init(),
    dashboard.init(),
    userroles.init()
] 
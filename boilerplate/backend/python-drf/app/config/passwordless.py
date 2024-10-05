import os

from supertokens_python.recipe import passwordless, session, dashboard
from supertokens_python.recipe.passwordless import ContactEmailOrPhoneConfig
from supertokens_python import (
    InputAppInfo,
    SupertokensConfig,
)

def get_api_domain():
    api_port = os.getenv("REACT_APP_API_PORT") or os.getenv("VITE_API_PORT") or "3001"
    api_url = os.getenv("REACT_APP_API_URL") or f"http://localhost:{api_port}"
    return api_url

def get_website_domain():
    website_port = os.getenv("REACT_APP_WEBSITE_PORT") or os.getenv("VITE_APP_PORT") or os.getenv("PORT") or "3000"
    website_url = os.getenv("REACT_APP_WEBSITE_URL") or f"http://localhost:{website_port}"
    return website_url

# this is the location of the SuperTokens core.
supertokens_config = SupertokensConfig(
    connection_uri="https://try.supertokens.com")

app_info = InputAppInfo(
    app_name="Supertokens",
    api_domain=get_api_domain(),
    website_domain=get_website_domain(),
)

# recipeList contains all the modules that you want to
# use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
recipe_list = [
    session.init(),
    passwordless.init(
        flow_type="USER_INPUT_CODE_AND_MAGIC_LINK",
        contact_config=ContactEmailOrPhoneConfig()
    ),
    dashboard.init()
]

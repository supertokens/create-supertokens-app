from supertokens_python.recipe import passwordless, session
from supertokens_python.recipe.passwordless import ContactEmailOrPhoneConfig
from supertokens_python import (
    InputAppInfo,
    SupertokensConfig,
)

supertokens_config=SupertokensConfig(connection_uri="https://try.supertokens.io")

app_info=InputAppInfo(
    app_name="Supertokens",
    api_domain="http://localhost:3001",
    website_domain="http://localhost:3000",
)

framework="flask"

recipe_list=[
    session.init(),
    passwordless.init(
        flow_type="USER_INPUT_CODE_AND_MAGIC_LINK",
        contact_config=ContactEmailOrPhoneConfig()
    )
]
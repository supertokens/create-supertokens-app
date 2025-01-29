from supertokens_python import init, InputAppInfo, SupertokensConfig
from supertokens_python.recipe import emailpassword, thirdparty, passwordless, session, dashboard
from supertokens_python.recipe.passwordless import ContactEmailOrPhoneConfig
from supertokens_python.recipe.thirdparty.provider import ProviderInput, ProviderConfig, ProviderClientConfig
from ...shared.config.base import (
    default_app_info,
    default_supertokens_config,
    default_oauth_providers
)

# this is the location of the SuperTokens core.
supertokens_config = SupertokensConfig(
    connection_uri=default_supertokens_config["connection_uri"])

app_info = InputAppInfo(
    app_name=default_app_info["app_name"],
    api_domain=default_app_info["api_domain"],
    website_domain=default_app_info["website_domain"],
)

framework = "fastapi"

# recipeList contains all the modules that you want to
# use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
recipe_list = [
    session.init(),
    emailpassword.init(),
    passwordless.init(
        flow_type="USER_INPUT_CODE_AND_MAGIC_LINK",
        contact_config=ContactEmailOrPhoneConfig(),
    ),
    thirdparty.init(
        sign_in_and_up_feature=thirdparty.SignInAndUpFeature(providers=[
            ProviderInput(
                config=ProviderConfig(
                    third_party_id="google",
                    clients=[
                        ProviderClientConfig(
                            client_id=default_oauth_providers["google"]["client_id"],
                            client_secret=default_oauth_providers["google"]["client_secret"]
                        ),
                    ],
                ),
            ),
            ProviderInput(
                config=ProviderConfig(
                    third_party_id="github",
                    clients=[
                        ProviderClientConfig(
                            client_id=default_oauth_providers["github"]["client_id"],
                            client_secret=default_oauth_providers["github"]["client_secret"]
                        ),
                    ],
                ),
            ),
            ProviderInput(
                config=ProviderConfig(
                    third_party_id="apple",
                    clients=[
                        ProviderClientConfig(
                            client_id=default_oauth_providers["apple"]["client_id"],
                            additional_config=default_oauth_providers["apple"]["additional_config"]
                        ),
                    ],
                ),
            ),
            ProviderInput(
                config=ProviderConfig(
                    third_party_id="twitter",
                    clients=[
                        ProviderClientConfig(
                            client_id=default_oauth_providers["twitter"]["client_id"],
                            client_secret=default_oauth_providers["twitter"]["client_secret"]
                        ),
                    ],
                ),
            ),
        ])
    ),
    dashboard.init()
]

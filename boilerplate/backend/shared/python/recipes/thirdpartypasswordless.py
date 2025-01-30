from supertokens_python import init
from supertokens_python.recipe import thirdparty, passwordless, session, dashboard, userroles
from supertokens_python.recipe.thirdparty import ProviderInput, ProviderConfig, ProviderClientConfig
from supertokens_python.recipe.passwordless import ContactConfig, ContactEmailOnlyConfig
import os

def get_api_domain() -> str:
    api_port = os.environ.get("VITE_APP_API_PORT", "3001")
    api_url = os.environ.get("VITE_APP_API_URL", f"http://localhost:{api_port}")
    return api_url

def get_website_domain() -> str:
    website_port = os.environ.get("VITE_APP_WEBSITE_PORT", "3000")
    website_url = os.environ.get("VITE_APP_WEBSITE_URL", f"http://localhost:{website_port}")
    return website_url

# Initialize SuperTokens with ThirdParty and Passwordless recipes
init(
    supertokens_config={"connection_uri": "https://try.supertokens.com"},
    app_info={
        "app_name": "SuperTokens Demo App",
        "api_domain": get_api_domain(),
        "website_domain": get_website_domain(),
        "api_base_path": "/auth",
        "website_base_path": "/auth"
    },
    framework="fastapi",  # or "flask"
    recipe_list=[
        # Initialize ThirdParty recipe
        thirdparty.init(
            sign_in_and_up_feature=thirdparty.SignInAndUpFeature(
                providers=[
                    ProviderInput(
                        config=ProviderConfig(
                            third_party_id="google",
                            clients=[
                                ProviderClientConfig(
                                    client_id="1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
                                    client_secret="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",
                                ),
                            ],
                        ),
                    ),
                    ProviderInput(
                        config=ProviderConfig(
                            third_party_id="github",
                            clients=[
                                ProviderClientConfig(
                                    client_id="467101b197249757c71f",
                                    client_secret="e97051221f4b6426e8fe8d51486396703012f5bd",
                                ),
                            ],
                        ),
                    ),
                ]
            ),
        ),
        # Initialize Passwordless recipe
        passwordless.init(
            contact_config=ContactConfig(
                contact_method="EMAIL",
                email_delivery=ContactEmailOnlyConfig(
                    service=None  # Use default email service
                ),
            ),
            flow_type="USER_INPUT_CODE_AND_MAGIC_LINK",
        ),
        session.init(
            cookie_same_site="lax",
            cookie_secure=False,
            anti_csrf="NONE"
        ),
        dashboard.init(api_key=os.environ.get("DASHBOARD_API_KEY")),
        userroles.init()
    ],
    mode="asgi",  # or "wsgi"
    telemetry=False
) 
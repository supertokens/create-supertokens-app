from supertokens_python import init, InputAppInfo, SupertokensConfig
from supertokens_python.recipe import thirdpartyemailpassword, session, dashboard, userroles
from supertokens_python.recipe.thirdpartyemailpassword.provider import Provider
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
    thirdpartyemailpassword.init(
        providers=[
            Provider(
                config=Provider.ProviderConfig(
                    third_party_id="google",
                    clients=[
                        Provider.ProviderClient(
                            client_id="1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
                            client_secret="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"
                        ),
                    ],
                ),
            ),
            Provider(
                config=Provider.ProviderConfig(
                    third_party_id="github",
                    clients=[
                        Provider.ProviderClient(
                            client_id="467101b197249757c71f",
                            client_secret="e97051221f4b6426e8fe8d51486396703012f5bd"
                        ),
                    ],
                ),
            ),
            Provider(
                config=Provider.ProviderConfig(
                    third_party_id="apple",
                    clients=[
                        Provider.ProviderClient(
                            client_id="4398792-io.supertokens.example.service",
                            additional_config={
                                "key_id": "7M48Y4RYDL",
                                "private_key": "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
                                "team_id": "YWQCXGJRJL",
                            },
                        ),
                    ],
                ),
            ),
            Provider(
                config=Provider.ProviderConfig(
                    third_party_id="twitter",
                    clients=[
                        Provider.ProviderClient(
                            client_id="4398792-WXpqVXRiazdRMGNJdEZIa3RVQXc6MTpjaQ",
                            client_secret="BivMbtwmcygbRLNQ0zk45yxvW246tnYnTFFq-LH39NwZMxFpdC"
                        ),
                    ],
                ),
            ),
        ]
    ),
    session.init(),
    dashboard.init(),
    userroles.init()
] 
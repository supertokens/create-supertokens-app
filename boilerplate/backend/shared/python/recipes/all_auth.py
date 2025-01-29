from supertokens_python import init, InputAppInfo, SupertokensConfig
from supertokens_python.recipe import (
    thirdpartyemailpassword,
    thirdpartypasswordless,
    session,
    dashboard,
    userroles
)
from supertokens_python.recipe.thirdparty.provider import GoogleProvider, GithubProvider, AppleProvider
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
    thirdpartyemailpassword.init(
        providers=[
            GoogleProvider(
                client_id=os.environ.get("GOOGLE_CLIENT_ID", "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com"),
                client_secret=os.environ.get("GOOGLE_CLIENT_SECRET", "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")
            ),
            GithubProvider(
                client_id=os.environ.get("GITHUB_CLIENT_ID", "467101b197249757c71f"),
                client_secret=os.environ.get("GITHUB_CLIENT_SECRET", "e97051221f4b6426e8fe8d51486396703012f5bd")
            ),
            AppleProvider(
                client_id=os.environ.get("APPLE_CLIENT_ID", "4398792-io.supertokens.example.service"),
                key_id=os.environ.get("APPLE_KEY_ID", "7M48Y4RYDL"),
                private_key=os.environ.get("APPLE_PRIVATE_KEY", "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----").replace("\\n", "\n"),
                team_id=os.environ.get("APPLE_TEAM_ID", "YWQCXGJRJL")
            )
        ]
    ),
    thirdpartypasswordless.init(
        flow_type="USER_INPUT_CODE_AND_MAGIC_LINK",
        contact_config=ContactEmailOrPhoneConfig(),
        providers=[
            GoogleProvider(
                client_id=os.environ.get("GOOGLE_CLIENT_ID", "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com"),
                client_secret=os.environ.get("GOOGLE_CLIENT_SECRET", "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")
            ),
            GithubProvider(
                client_id=os.environ.get("GITHUB_CLIENT_ID", "467101b197249757c71f"),
                client_secret=os.environ.get("GITHUB_CLIENT_SECRET", "e97051221f4b6426e8fe8d51486396703012f5bd")
            ),
            AppleProvider(
                client_id=os.environ.get("APPLE_CLIENT_ID", "4398792-io.supertokens.example.service"),
                key_id=os.environ.get("APPLE_KEY_ID", "7M48Y4RYDL"),
                private_key=os.environ.get("APPLE_PRIVATE_KEY", "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----").replace("\\n", "\n"),
                team_id=os.environ.get("APPLE_TEAM_ID", "YWQCXGJRJL")
            )
        ]
    ),
    session.init(),
    dashboard.init(),
    userroles.init()
] 
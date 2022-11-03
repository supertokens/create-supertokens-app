from supertokens_python.recipe import session, thirdparty, dashboard
from supertokens_python.recipe.thirdparty import (
    Apple,
    Github,
    Google,
)
from supertokens_python import (
    InputAppInfo,
    SupertokensConfig,
)

# this is the location of the SuperTokens core.
supertokens_config = SupertokensConfig(
    connection_uri="https://try.supertokens.com")

app_info = InputAppInfo(
    app_name="Supertokens",
    api_domain="http://localhost:3001",
    website_domain="http://localhost:3000",
)

framework = "fastapi"

# recipeList contains all the modules that you want to
# use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
recipe_list = [
    session.init(),
    thirdparty.init(
        sign_in_and_up_feature=thirdparty.SignInAndUpFeature(providers=[
            # We have provided you with development keys which you can use for testing.
            # IMPORTANT: Please replace them with your own OAuth keys for production use.
            Google(
                client_id='1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com',
                client_secret='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'
            ),
            Github(
                client_id='467101b197249757c71f',
                client_secret='e97051221f4b6426e8fe8d51486396703012f5bd'
            ),
            Apple(
                client_id="4398792-io.supertokens.example.service",
                client_key_id="7M48Y4RYDL",
                client_private_key="-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
                client_team_id="YWQCXGJRJL"
            )
        ])
    ),
    dashboard.init(api_key="supertokens_is_awesome")
]

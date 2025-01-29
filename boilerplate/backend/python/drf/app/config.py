from supertokens_python import (
    InputAppInfo,
    SupertokensConfig,
)

# this is the location of the SuperTokens core.
supertokens_config = SupertokensConfig(connection_uri="")

app_info = InputAppInfo(
    app_name="",
    api_domain="",
    website_domain="",
)

# recipeList contains all the modules that you want to
# use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
recipe_list = []

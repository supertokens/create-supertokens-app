from supertokens_python.recipe import passwordless, session
from supertokens_python.recipe.passwordless import ContactEmailOrPhoneConfig

recipe_list=[
    session.init(),
    passwordless.init(
        flow_type="USER_INPUT_CODE_AND_MAGIC_LINK",
        contact_config=ContactEmailOrPhoneConfig()
    )
]
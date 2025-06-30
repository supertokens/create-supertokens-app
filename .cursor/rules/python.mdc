---
description: 
globs: 
alwaysApply: false
---
## Python

| factor          | py imports                                                                                                                         | py inits                                                                                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `emailpassword` | from supertokens_python.recipe import emailpassword<br>                                                                            | emailpassword.init()                                                                                                                                       |
| `thirdparty`    | from supertokens_python.recipe import thirdparty                                                                                   | thirdparty.init(<br>        sign_in_and_up_feature=thirdparty.SignInAndUpFeature(providers=[<br>            // per-provider config<br>        ])<br>    ), |
| `link_email`    | from supertokens_python.recipe import paswordless<br><br>from supertokens_python.recipe.passwordless import ContactEmailConfig     | passwordless.init(<br>        flow_type="MAGIC_LINK",<br>        contact_config=ContactEmailConfig(),<br>    ),                                            |
| `link_phone`    | from supertokens_python.recipe import paswordless<br><br>from supertokens_python.recipe.passwordless import ContactPhoneConfig     | passwordless.init(<br>        flow_type="MAGIC_LINK",<br>        contact_config=ContactPhoneConfig(),<br>    ),                                            |
| `otp_phone`     | from supertokens_python.recipe import paswordless<br><br>from supertokens_python.recipe.passwordless import ContactPhoneConfig     | passwordless.init(<br>        flow_type="USER_INPUT_CODE",<br>        contact_config=ContactPhoneConfig(),<br>    ),                                       |
| `otp_email`     | from supertokens_python.recipe import <br>paswordless<br><br>from supertokens_python.recipe.passwordless import ContactEmailConfig | passwordless.init(<br>        flow_type="USER_INPUT_CODE",<br>        contact_config=ContactEmailConfig(),<br>    ),                                       |
| `totp`          | from supertokens_python.recipe import <br>totp                                                                                     | totp.init(),                                                                                                                                               |

**Notes**: 
- session, dashboard, userroles also imported for all factors, in addition to their own config.
- if both link_email and link_phone are present as factors, the contact_config in init becomes ContactEmailOrPhoneConfig().
- if both otp_email and otp_phone are present as factors, the flowType in init becomes "USER_INPUT_CODE_AND_MAGIC_LINK".
- If a second factor is present, always include the multifactorauth recipe.
- For any multifactor recipes, also include accountlinking and emailverfiation.
- Second factors specific behavior always go in the override function of the MultiFactorAuth recipe!


### Examples

#### All auth

```python
from supertokens_python import init, InputAppInfo, SupertokensConfig
from supertokens_python.recipe import emailpassword, thirdparty, passwordless, session, dashboard
from supertokens_python.recipe.passwordless import ContactEmailOrPhoneConfig
from supertokens_python.recipe.thirdparty.provider import ProviderInput, ProviderConfig, ProviderClientConfig
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
                            client_id='1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com',
                            client_secret='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'
                        ),
                    ],
                ),
            ),
            ProviderInput(
                config=ProviderConfig(
                    third_party_id="github",
                    clients=[
                        ProviderClientConfig(
                            client_id='467101b197249757c71f',
                            client_secret='e97051221f4b6426e8fe8d51486396703012f5bd'
                        ),
                    ],
                ),
            ),
            ProviderInput(
                config=ProviderConfig(
                    third_party_id="apple",
                    clients=[
                        ProviderClientConfig(
                            client_id="4398792-io.supertokens.example.service",
                            additional_config={
                                "keyId": "7M48Y4RYDL",
                                "privateKey": "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
                                "teamId": "YWQCXGJRJL",
                            },
                        ),
                    ],
                ),
            ),
            ProviderInput(
                config=ProviderConfig(
                    third_party_id="twitter",
                    clients=[
                        ProviderClientConfig(
                            client_id='4398792-WXpqVXRiazdRMGNJdEZIa3RVQXc6MTpjaQ',
                            client_secret='BivMbtwmcygbRLNQ0zk45yxvW246tnYnTFFq-LH39NwZMxFpdC'
                        ),
                    ],
                ),
            ),
        ])
    ),
    dashboard.init()
]
```

#### Multi-factor auth 

```python
from supertokens_python.recipe import (
    session,
    thirdparty,
    emailpassword,
    dashboard,
    passwordless,
    multifactorauth,
    emailverification,
    accountlinking,
    totp,
)
from supertokens_python.recipe.accountlinking.types import (
    AccountInfoWithRecipeIdAndUserId,
    ShouldAutomaticallyLink,
    ShouldNotAutomaticallyLink,
)
from supertokens_python.recipe.multifactorauth.types import OverrideConfig
from supertokens_python.recipe.passwordless import ContactEmailOrPhoneConfig
from supertokens_python.recipe.multifactorauth.interfaces import (
    RecipeInterface as MFARecipeInterface,
)
from supertokens_python.recipe.multifactorauth.types import (
    MFARequirementList,
    FactorIds,
)
from supertokens_python.recipe.session import SessionContainer
from supertokens_python.recipe.thirdparty.provider import (
    ProviderInput,
    ProviderConfig,
    ProviderClientConfig,
)
from supertokens_python import (
    InputAppInfo,
    SupertokensConfig,
)
from supertokens_python.types import User
from typing import Optional, Dict, Any, Callable, Awaitable, List, Union


# this is the location of the SuperTokens core.
supertokens_config = SupertokensConfig(connection_uri="https://try.supertokens.com")

app_info = InputAppInfo(
    app_name="Supertokens",
    api_domain="http://localhost:3001",
    website_domain="http://localhost:3000",
)


async def should_do_automatic_account_linking(
    new_account_info: AccountInfoWithRecipeIdAndUserId,
    user: Optional[User],
    session: Optional[SessionContainer],
    tenant_id: str,
    user_context: Dict[str, Any],
) -> Union[ShouldNotAutomaticallyLink, ShouldAutomaticallyLink]:
    return ShouldAutomaticallyLink(should_require_verification=True)


def override_multifactor_functions(original_implementation: MFARecipeInterface):
    # Override the MFA requirements
    async def get_mfa_requirements_for_auth(
        tenant_id: str,
        access_token_payload: Dict[str, Any],
        completed_factors: Dict[str, int],
        user: Callable[[], Awaitable[User]],
        factors_set_up_for_user: Callable[[], Awaitable[List[str]]],
        required_secondary_factors_for_user: Callable[[], Awaitable[List[str]]],
        required_secondary_factors_for_tenant: Callable[[], Awaitable[List[str]]],
        user_context: Dict[str, Any],
    ) -> MFARequirementList:
        return [
            {
                "oneOf": [
                    FactorIds.TOTP,
                    FactorIds.OTP_EMAIL,
                    FactorIds.OTP_PHONE,
                ],
            }
        ]

    # Patch the original implementation to use our overridden function
    original_implementation.get_mfa_requirements_for_auth = (
        get_mfa_requirements_for_auth
    )
    return original_implementation


# recipeList contains all the modules that you want to
# use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
recipe_list = [
    emailpassword.init(),
    thirdparty.init(
        sign_in_and_up_feature=thirdparty.SignInAndUpFeature(
            providers=[
                # We have provided you with development keys which you can use for testing.
                # IMPORTANT: Please replace them with your own OAuth keys for production use.
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
                ProviderInput(
                    config=ProviderConfig(
                        third_party_id="apple",
                        clients=[
                            ProviderClientConfig(
                                client_id="4398792-io.supertokens.example.service",
                                additional_config={
                                    "keyId": "7M48Y4RYDL",
                                    "privateKey": "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
                                    "teamId": "YWQCXGJRJL",
                                },
                            ),
                        ],
                    ),
                ),
                ProviderInput(
                    config=ProviderConfig(
                        third_party_id="twitter",
                        clients=[
                            ProviderClientConfig(
                                client_id="4398792-WXpqVXRiazdRMGNJdEZIa3RVQXc6MTpjaQ",
                                client_secret="BivMbtwmcygbRLNQ0zk45yxvW246tnYnTFFq-LH39NwZMxFpdC",
                            ),
                        ],
                    ),
                ),
            ]
        )
    ),
    passwordless.init(
        flow_type="USER_INPUT_CODE_AND_MAGIC_LINK",
        contact_config=ContactEmailOrPhoneConfig(),
    ),
    emailverification.init(mode="REQUIRED"),
    accountlinking.init(
        should_do_automatic_account_linking=should_do_automatic_account_linking
    ),
    multifactorauth.init(
        first_factors=["thirdparty", "emailpassword"],
        override=OverrideConfig(
            functions=override_multifactor_functions,
        ),
    ),
    totp.init(),
    session.init(),
    dashboard.init(),
]
```

#### Multitenancy

```python
from supertokens_python.recipe import session, thirdparty, emailpassword, dashboard, passwordless
from supertokens_python.recipe.passwordless import ContactEmailOrPhoneConfig
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

# recipeList contains all the modules that you want to
# use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
recipe_list = [
    session.init(),
    thirdparty.init(),
    emailpassword.init(),
    passwordless.init(
        flow_type="USER_INPUT_CODE_AND_MAGIC_LINK",
        contact_config=ContactEmailOrPhoneConfig(),
    ),
    dashboard.init()
]
```

These rules and examples apply only to [py.ts](mdc:boilerplate/backend/shared/python/py.ts) - and nowhere outside of it.




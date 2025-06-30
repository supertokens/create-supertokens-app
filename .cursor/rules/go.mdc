---
description: 
globs: 
alwaysApply: false
---
## Go

| factor          | go imports                                                                                                                                                        | go inits                                                                                                                                                                                                         |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `emailpassword` | import (<br>	"github.com/supertokens/supertokens-golang/recipe/emailpassword"<br>)                                                                                | emailpassword.Init(nil),                                                                                                                                                                                         |
| `thirdparty`    | import (<br>	"github.com/supertokens/supertokens-golang/recipe/thirdparty"<br>	"github.com/supertokens/supertokens-golang/recipe/thirdparty/tpmodels"<br>)        | thirdparty.Init(&tpmodels.TypeInput{<br>			SignInAndUpFeature: tpmodels.TypeInputSignInAndUp{<br>				Providers: []tpmodels.ProviderInput{<br>					// per-provider config<br>					},<br>				},<br>			},<br>		}),  |
| `link_email`    | import (<br>	"github.com/supertokens/supertokens-golang/recipe/passwordless"<br>	"github.com/supertokens/supertokens-golang/recipe/passwordless/plessmodels"<br>) | passwordless.Init(plessmodels.TypeInput{<br>			FlowType: "MAGIC_LINK",<br>			ContactMethodEmailOrPhone: plessmodels.ContactMethodEmailOrPhoneConfig{<br>				Enabled: true,<br>			},<br>		}),                     |
| `link_phone`    | import (<br>	"github.com/supertokens/supertokens-golang/recipe/passwordless"<br>	"github.com/supertokens/supertokens-golang/recipe/passwordless/plessmodels"<br>) | passwordless.Init(plessmodels.TypeInput{<br>			FlowType: "MAGIC_LINK",<br>			ContactMethodEmailOrPhone: plessmodels.ContactMethodEmailOrPhoneConfig{<br>				Enabled: true,<br>			},<br>		}),                     |
| `otp_phone`     | import (<br>	"github.com/supertokens/supertokens-golang/recipe/passwordless"<br>	"github.com/supertokens/supertokens-golang/recipe/passwordless/plessmodels"<br>) | passwordless.Init(plessmodels.TypeInput{<br>			FlowType: "USER_INPUT_CODE_AND_MAGIC_LINK",<br>			ContactMethodEmailOrPhone: plessmodels.ContactMethodEmailOrPhoneConfig{<br>				Enabled: true,<br>			},<br>		}), |
| `otp_email`     | import (<br>	"github.com/supertokens/supertokens-golang/recipe/passwordless"<br>	"github.com/supertokens/supertokens-golang/recipe/passwordless/plessmodels"<br>) | passwordless.Init(plessmodels.TypeInput{<br>			FlowType: "USER_INPUT_CODE_AND_MAGIC_LINK",<br>			ContactMethodEmailOrPhone: plessmodels.ContactMethodEmailOrPhoneConfig{<br>				Enabled: true,<br>			},<br>		}), |

**Notes**: 
- session, dashboard, userroles also imported for all factors, in addition to their own config.
- There's no MFA for GO currently, so only a first factor input would be valid.


### Examples

#### All auth:

```go
package main

import (
	"github.com/supertokens/supertokens-golang/recipe/dashboard"
	"github.com/supertokens/supertokens-golang/recipe/session"
	"github.com/supertokens/supertokens-golang/recipe/emailpassword"
	"github.com/supertokens/supertokens-golang/recipe/thirdparty"
	"github.com/supertokens/supertokens-golang/recipe/thirdparty/tpmodels"
	"github.com/supertokens/supertokens-golang/recipe/passwordless"
	"github.com/supertokens/supertokens-golang/recipe/passwordless/plessmodels"
	"github.com/supertokens/supertokens-golang/supertokens"
)

var SuperTokensConfig = supertokens.TypeInput{
	Supertokens: &supertokens.ConnectionInfo{
		ConnectionURI: "https://try.supertokens.com",
	},
	AppInfo: supertokens.AppInfo{
		AppName:       "SuperTokens Demo App",
		APIDomain:     "http://localhost:3001",
		WebsiteDomain: "http://localhost:3000",
	},
	RecipeList: []supertokens.Recipe{
		emailpassword.Init(nil),
		passwordless.Init(plessmodels.TypeInput{
			FlowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
			ContactMethodEmailOrPhone: plessmodels.ContactMethodEmailOrPhoneConfig{
				Enabled: true,
			},
		}),
		thirdparty.Init(&tpmodels.TypeInput{
			SignInAndUpFeature: tpmodels.TypeInputSignInAndUp{
				Providers: []tpmodels.ProviderInput{
					{
						Config: tpmodels.ProviderConfig{
							ThirdPartyId: "google",
							Clients: []tpmodels.ProviderClientConfig{
								{
									ClientID:     "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
									ClientSecret: "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",
								},
							},
						},
					},
					{
						Config: tpmodels.ProviderConfig{
							ThirdPartyId: "github",
							Clients: []tpmodels.ProviderClientConfig{
								{
									ClientID:     "467101b197249757c71f",
									ClientSecret: "e97051221f4b6426e8fe8d51486396703012f5bd",
								},
							},
						},
					},
					{
						Config: tpmodels.ProviderConfig{
							ThirdPartyId: "twitter",
							Clients: []tpmodels.ProviderClientConfig{
								{
									ClientID:     "4398792-WXpqVXRiazdRMGNJdEZIa3RVQXc6MTpjaQ",
									ClientSecret: "BivMbtwmcygbRLNQ0zk45yxvW246tnYnTFFq-LH39NwZMxFpdC",
								},
							},
						},
					},
					{
						Config: tpmodels.ProviderConfig{
							ThirdPartyId: "apple",
							Clients: []tpmodels.ProviderClientConfig{
								{
									ClientID: "4398792-io.supertokens.example.service",
									AdditionalConfig: map[string]interface{}{
										"keyId":      "7M48Y4RYDL",
										"privateKey": "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
										"teamId":     "YWQCXGJRJL",
									},
								},
							},
						},
					},
				},
			},
		}),
		session.Init(nil), // initializes session features
		dashboard.Init(nil),
	},
}
```


These rules and examples apply only to [go.ts](mdc:boilerplate/backend/shared/go/go.ts) - and nowhere outside of it.



package main

import (
	"github.com/supertokens/supertokens-golang/recipe/dashboard"
	"github.com/supertokens/supertokens-golang/recipe/dashboard/dashboardmodels"
	"github.com/supertokens/supertokens-golang/recipe/passwordless/plessmodels"
	"github.com/supertokens/supertokens-golang/recipe/session"
	"github.com/supertokens/supertokens-golang/recipe/thirdparty"
	"github.com/supertokens/supertokens-golang/recipe/thirdparty/tpmodels"
	"github.com/supertokens/supertokens-golang/recipe/thirdpartypasswordless"
	"github.com/supertokens/supertokens-golang/recipe/thirdpartypasswordless/tplmodels"
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
		thirdpartypasswordless.Init(tplmodels.TypeInput{
			FlowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
			ContactMethodEmailOrPhone: plessmodels.ContactMethodEmailOrPhoneConfig{
				Enabled: true,
			},
			Providers: [] tpmodels.TypeProvider{
				thirdparty.Google(tpmodels.GoogleConfig{
					ClientID:     "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
					ClientSecret: "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",
				}),
				thirdparty.Github(tpmodels.GithubConfig{
					ClientID:     "467101b197249757c71f",
					ClientSecret: "e97051221f4b6426e8fe8d51486396703012f5bd",
				}),
				thirdparty.Apple(tpmodels.AppleConfig{
					ClientID: "4398792-io.supertokens.example.service",
					ClientSecret: tpmodels.AppleClientSecret{
						KeyId:      "7M48Y4RYDL",
						PrivateKey: "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
						TeamId:     "YWQCXGJRJL",
					},
				}),
			},
		}),
		session.Init(nil), // initializes session features
		dashboard.Init(dashboardmodels.TypeInput{
			ApiKey: "supertokens_is_awesome",
		}),
	},
}
package main

import (
	"github.com/supertokens/supertokens-golang/recipe/dashboard"
	"github.com/supertokens/supertokens-golang/recipe/session"
	"github.com/supertokens/supertokens-golang/recipe/thirdparty/tpmodels"
	"github.com/supertokens/supertokens-golang/recipe/thirdpartyemailpassword"
	"github.com/supertokens/supertokens-golang/recipe/thirdpartyemailpassword/tpepmodels"
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
		thirdpartyemailpassword.Init(&tpepmodels.TypeInput{
			/*
			   We use different credentials for different platforms when required. For example the redirect URI for Github
			   is different for Web and mobile. In such a case we can provide multiple providers with different client Ids.

			   When the frontend makes a request and wants to use a specific clientId, it needs to send the clientId to use in the
			   request. In the absence of a clientId in the request the SDK uses the default provider, indicated by `isDefault: true`.
			   When adding multiple providers for the same type (Google, Github etc), make sure to set `isDefault: true`.
			*/
			Providers: []tpmodels.ProviderInput{
				// We have provided you with development keys which you can use for testsing.
				// IMPORTANT: Please replace them with your own OAuth keys for production use.
				{
					Config: tpmodels.ProviderConfig{
						ThirdPartyId: "google",
						Clients: []tpmodels.ProviderClientConfig{
							// We use this for websites
							{
								ClientID:     "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
								ClientSecret: "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",
								ClientType: "web",
							},
							// we use this for mobile apps
							{
								ClientID:     "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
								ClientSecret: "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",
								ClientType:  "mobile",
							},
						},
					},
				},
				{
					Config: tpmodels.ProviderConfig{
						ThirdPartyId: "github",
						Clients: []tpmodels.ProviderClientConfig{
							// We use this for websites
							{
								ClientID:     "467101b197249757c71f",
								ClientSecret: "e97051221f4b6426e8fe8d51486396703012f5bd",
								ClientType: "web",
							},
							// We use this for mobile apps
							{
								ClientID:     "8a9152860ce869b64c44",
								ClientSecret: "00e841f10f288363cd3786b1b1f538f05cfdbda2",
							},
						},
					},
				},
				/*
				   For Apple signin, iOS apps always use the bundle identifier as the client ID when communicating with Apple. Android, Web and other platforms
				   need to configure a Service ID on the Apple developer dashboard and use that as client ID.
				   In the example below 4398792-io.supertokens.example.service is the client ID for Web. Android etc and thus we mark it as default. For iOS
				   the frontend for the demo app sends the clientId in the request which is then used by the SDK.
				*/
				{
					Config: tpmodels.ProviderConfig{
						ThirdPartyId: "apple",
						Clients: []tpmodels.ProviderClientConfig{
							// For Android and website apps
							{
								ClientID: "4398792-io.supertokens.example.service",
								AdditionalConfig: map[string]interface{}{
									"keyId":      "7M48Y4RYDL",
									"privateKey": "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
									"teamId":     "YWQCXGJRJL",
								},
							},
							// For iOS Apps
							{
								ClientID: "4398792-io.supertokens.example",
								AdditionalConfig: map[string]interface{}{
									"keyId":      "7M48Y4RYDL",
									"privateKey": "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
									"teamId":     "YWQCXGJRJL",
								},
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
			},
		}),
		session.Init(nil),
		dashboard.Init(nil),
	},
}

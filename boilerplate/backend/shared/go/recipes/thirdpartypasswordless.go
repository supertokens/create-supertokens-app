package main

import (
	"fmt"
	"os"

	"github.com/supertokens/supertokens-golang/recipe/dashboard"
	"github.com/supertokens/supertokens-golang/recipe/passwordless"
	"github.com/supertokens/supertokens-golang/recipe/passwordless/plessmodels"
	"github.com/supertokens/supertokens-golang/recipe/session"
	"github.com/supertokens/supertokens-golang/recipe/thirdparty"
	"github.com/supertokens/supertokens-golang/recipe/thirdparty/tpmodels"
	"github.com/supertokens/supertokens-golang/recipe/userroles"
	"github.com/supertokens/supertokens-golang/supertokens"
)

func getApiDomain() string {
	apiPort := os.Getenv("VITE_APP_API_PORT")
	if apiPort == "" {
		apiPort = "3001"
	}
	apiUrl := os.Getenv("VITE_APP_API_URL")
	if apiUrl == "" {
		apiUrl = fmt.Sprintf("http://localhost:%s", apiPort)
	}
	return apiUrl
}

func getWebsiteDomain() string {
	websitePort := os.Getenv("VITE_APP_WEBSITE_PORT")
	if websitePort == "" {
		websitePort = "3000"
	}
	websiteUrl := os.Getenv("VITE_APP_WEBSITE_URL")
	if websiteUrl == "" {
		websiteUrl = fmt.Sprintf("http://localhost:%s", websitePort)
	}
	return websiteUrl
}

func getStringPointer(s string) *string {
	return &s
}

// SuperTokensConfig is the configuration for SuperTokens core with ThirdPartyPasswordless recipe
var SuperTokensConfig = supertokens.TypeInput{
	Supertokens: &supertokens.ConnectionInfo{
		ConnectionURI: "https://try.supertokens.io",
	},
	AppInfo: supertokens.AppInfo{
		AppName:         "SuperTokens Demo App",
		APIDomain:       "http://localhost:3001",
		WebsiteDomain:   "http://localhost:3000",
		APIBasePath:     getStringPointer("/auth"),
		WebsiteBasePath: getStringPointer("/auth"),
	},
	RecipeList: []supertokens.Recipe{
		thirdparty.Init(&tpmodels.TypeInput{
			SignInAndUpFeature: tpmodels.TypeInputSignInAndUp{
				Providers: []tpmodels.ProviderInput{
					// We have provided you with development keys which you can use for testing.
					// IMPORTANT: Please replace them with your own OAuth keys for production use.
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
		passwordless.Init(plessmodels.TypeInput{
			FlowType: "MAGIC_LINK",
			ContactMethodEmailOrPhone: plessmodels.ContactMethodEmailOrPhoneConfig{
				Enabled: true,
			},
		}),
		session.Init(nil),
		dashboard.Init(nil),
		userroles.Init(nil),
	},
} 
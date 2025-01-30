package main

import (
	"fmt"
	"os"

	"github.com/supertokens/supertokens-golang/recipe/dashboard"
	"github.com/supertokens/supertokens-golang/recipe/emailpassword"
	"github.com/supertokens/supertokens-golang/recipe/multitenancy"
	"github.com/supertokens/supertokens-golang/recipe/multitenancy/multitenancymodels"
	"github.com/supertokens/supertokens-golang/recipe/passwordless"
	"github.com/supertokens/supertokens-golang/recipe/passwordless/plessmodels"
	"github.com/supertokens/supertokens-golang/recipe/session"
	"github.com/supertokens/supertokens-golang/recipe/thirdparty"
	"github.com/supertokens/supertokens-golang/recipe/thirdparty/tpmodels"
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

// MultitenancyConfig contains the SuperTokens configuration for multitenancy
var MultitenancyConfig = supertokens.TypeInput{
	Supertokens: &supertokens.ConnectionInfo{
		ConnectionURI: "https://try.supertokens.com",
	},
	AppInfo: supertokens.AppInfo{
		AppName:       "SuperTokens Demo App",
		APIDomain:     getApiDomain(),
		WebsiteDomain: getWebsiteDomain(),
	},
	RecipeList: []supertokens.Recipe{
		multitenancy.Init(&multitenancymodels.TypeInput{
			DefaultTenantId: "public",
		}),
		thirdparty.Init(&tpmodels.TypeInput{
			SignInAndUpFeature: tpmodels.TypeInputSignInAndUp{
				Providers: []tpmodels.TypeProvider{
					{
						Config: tpmodels.ProviderConfig{
							ThirdPartyId: "google",
							Clients: []tpmodels.ProviderClient{
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
							Clients: []tpmodels.ProviderClient{
								{
									ClientID:     "467101b197249757c71f",
									ClientSecret: "e97051221f4b6426e8fe8d51486396703012f5bd",
								},
							},
						},
					},
				},
			},
		}),
		emailpassword.Init(nil),
		passwordless.Init(&plessmodels.TypeInput{
			FlowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
			ContactMethodEmail: plessmodels.ContactMethodEmailConfig{
				Enabled: true,
			},
		}),
		session.Init(nil),
		dashboard.Init(nil),
	},
}

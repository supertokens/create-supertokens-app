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
	sharedConfig "../../../shared/config"
)

var SuperTokensConfig = supertokens.TypeInput{
	Supertokens: &supertokens.ConnectionInfo{
		ConnectionURI: sharedConfig.DefaultSupertokensConfig["connectionURI"],
	},
	AppInfo: supertokens.AppInfo{
		AppName:       sharedConfig.DefaultAppInfo["appName"],
		APIDomain:     sharedConfig.DefaultAppInfo["apiDomain"],
		WebsiteDomain: sharedConfig.DefaultAppInfo["websiteDomain"],
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
				Providers: []tpmodels.TypeProvider{
					{
						Config: tpmodels.ProviderConfig{
							ThirdPartyId: "google",
							Clients: []tpmodels.ProviderClient{
								{
									ClientID:     sharedConfig.DefaultOAuthProviders["google"].ClientID,
									ClientSecret: sharedConfig.DefaultOAuthProviders["google"].ClientSecret,
								},
							},
						},
					},
					{
						Config: tpmodels.ProviderConfig{
							ThirdPartyId: "github",
							Clients: []tpmodels.ProviderClient{
								{
									ClientID:     sharedConfig.DefaultOAuthProviders["github"].ClientID,
									ClientSecret: sharedConfig.DefaultOAuthProviders["github"].ClientSecret,
								},
							},
						},
					},
					{
						Config: tpmodels.ProviderConfig{
							ThirdPartyId: "apple",
							Clients: []tpmodels.ProviderClient{
								{
									ClientID:         sharedConfig.DefaultOAuthProviders["apple"].ClientID,
									AdditionalConfig: sharedConfig.DefaultOAuthProviders["apple"].Additional,
								},
							},
						},
					},
					{
						Config: tpmodels.ProviderConfig{
							ThirdPartyId: "twitter",
							Clients: []tpmodels.ProviderClient{
								{
									ClientID:     sharedConfig.DefaultOAuthProviders["twitter"].ClientID,
									ClientSecret: sharedConfig.DefaultOAuthProviders["twitter"].ClientSecret,
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

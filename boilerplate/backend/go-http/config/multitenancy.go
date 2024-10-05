package main

import (
	"os"

	"github.com/supertokens/supertokens-golang/recipe/dashboard"
	"github.com/supertokens/supertokens-golang/recipe/emailpassword"
	"github.com/supertokens/supertokens-golang/recipe/passwordless"
	"github.com/supertokens/supertokens-golang/recipe/passwordless/plessmodels"
	"github.com/supertokens/supertokens-golang/recipe/session"
	"github.com/supertokens/supertokens-golang/recipe/thirdparty"
	"github.com/supertokens/supertokens-golang/supertokens"
)

func getApiDomain() string {
	apiPortStr := os.Getenv("REACT_APP_API_PORT")
	if apiPortStr == "" {
		apiPortStr = os.Getenv("VITE_API_PORT")
		if apiPortStr == "" {
			apiPortStr = "3001"
		}
	}
	apiUrl := os.Getenv("REACT_APP_API_URL")
	if apiUrl == "" {
		apiUrl = "http://localhost:" + apiPortStr
	}

	return apiUrl
}

func getWebsiteDomain() string {
	websitePortStr := os.Getenv("PORT")
	if websitePortStr == "" {
		websitePortStr = os.Getenv("VITE_APP_PORT")
		if websitePortStr == "" {
			websitePortStr = "3000"
		}
	}
	websiteUrl := os.Getenv("REACT_APP_WEBSITE_URL")
	if websiteUrl == "" {
		websiteUrl = "http://localhost:" + websitePortStr
	}

	return websiteUrl
}

var SuperTokensConfig = supertokens.TypeInput{
	Supertokens: &supertokens.ConnectionInfo{
		ConnectionURI: "https://try.supertokens.com",
	},
	AppInfo: supertokens.AppInfo{
		AppName:       "SuperTokens Demo App",
		APIDomain:     getApiDomain(),
		WebsiteDomain: getWebsiteDomain(),
	},
	RecipeList: []supertokens.Recipe{
		thirdparty.Init(nil),
		emailpassword.Init(nil),
		passwordless.Init(plessmodels.TypeInput{
			FlowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
			ContactMethodEmail: plessmodels.ContactMethodEmailConfig{
				Enabled: true,
			},
		}),
		session.Init(nil),
		dashboard.Init(nil),
	},
}

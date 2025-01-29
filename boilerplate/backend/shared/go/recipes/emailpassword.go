package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/supertokens/supertokens-golang/recipe/dashboard"
	"github.com/supertokens/supertokens-golang/recipe/emailpassword"
	"github.com/supertokens/supertokens-golang/recipe/emailpassword/epmodels"
	"github.com/supertokens/supertokens-golang/recipe/session"
	"github.com/supertokens/supertokens-golang/recipe/session/sessmodels"
	"github.com/supertokens/supertokens-golang/recipe/userroles"
	"github.com/supertokens/supertokens-golang/supertokens"
)

// SuperTokensConfig is the configuration for SuperTokens core with EmailPassword recipe
var SuperTokensConfig = supertokens.TypeInput{
	Supertokens: &supertokens.ConnectionInfo{
		ConnectionURI: "https://try.supertokens.io",
	},
	AppInfo: supertokens.AppInfo{
		AppName:         "SuperTokens Demo App",
		APIDomain:       getApiDomain(),
		WebsiteDomain:   getWebsiteDomain(),
		APIBasePath:     getStringPointer("/auth"),
		WebsiteBasePath: getStringPointer("/auth"),
	},
	RecipeList: []supertokens.Recipe{
		emailpassword.Init(&epmodels.TypeInput{
			SignUpFeature: &epmodels.TypeInputSignUp{
				FormFields: []epmodels.TypeInputFormField{
					{
						ID: "email",
						Validate: func(value interface{}, tenantId string) *string {
							if value == nil {
								return getStringPointer("Email is required")
							}
							if email, ok := value.(string); !ok || len(email) == 0 {
								return getStringPointer("Email is invalid")
							}
							return nil
						},
					},
					{
						ID: "password",
						Validate: func(value interface{}, tenantId string) *string {
							if value == nil {
								return getStringPointer("Password is required")
							}
							if password, ok := value.(string); !ok || len(password) < 8 {
								return getStringPointer("Password must be at least 8 characters")
							}
							return nil
						},
					},
				},
			},
		}),
		session.Init(&sessmodels.TypeInput{
			GetTokenTransferMethod: func(req *http.Request, forCreateNewSession bool, userContext *map[string]interface{}) sessmodels.TokenTransferMethod {
				return sessmodels.CookieTransferMethod
			},
			AntiCsrf:       getStringPointer("NONE"),
			CookieDomain:   nil, // Set this if you want to share session across subdomains
			CookieSecure:   getBoolPointer(false),
			CookieSameSite: getStringPointer("lax"),
		}),
		dashboard.Init(nil),
		userroles.Init(nil),
	},
}

func getStringPointer(s string) *string {
	return &s
}

func getBoolPointer(b bool) *bool {
	return &b
}

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
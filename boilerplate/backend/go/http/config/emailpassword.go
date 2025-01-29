package main

import (
	"github.com/supertokens/supertokens-golang/recipe/dashboard"
	"github.com/supertokens/supertokens-golang/recipe/emailpassword"
	"github.com/supertokens/supertokens-golang/recipe/session"
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
		session.Init(nil),
		dashboard.Init(nil),
	},
}

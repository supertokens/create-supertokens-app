package main

import (
    "fmt"
    "os"

    "github.com/supertokens/supertokens-golang/recipe/dashboard"
    "github.com/supertokens/supertokens-golang/recipe/session"
    "github.com/supertokens/supertokens-golang/recipe/passwordless"
    "github.com/supertokens/supertokens-golang/recipe/passwordless/plessmodels"
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

// SuperTokensConfig is the configuration for SuperTokens core with Passwordless recipe
var SuperTokensConfig = supertokens.TypeInput{
    Supertokens: &supertokens.ConnectionInfo{
        // This is the location of the SuperTokens core
        ConnectionURI: "https://try.supertokens.com",
    },
    AppInfo: supertokens.AppInfo{
        AppName:       "SuperTokens Demo App",
        APIDomain:     getApiDomain(),
        WebsiteDomain: getWebsiteDomain(),
    },
    RecipeList: []supertokens.Recipe{
        passwordless.Init(plessmodels.TypeInput{
            FlowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
            ContactMethodEmailOrPhone: plessmodels.ContactMethodEmailOrPhoneConfig{
                Enabled: true,
            },
        }),
        session.Init(nil),
        dashboard.Init(nil),
        userroles.Init(nil),
    },
} 
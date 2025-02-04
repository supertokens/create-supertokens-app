import { type OAuthProvider, type ConfigType } from "../../../../lib/ts/templateBuilder/types";
import { configToRecipes } from "../../../../lib/ts/templateBuilder/constants";
import { config } from "../config/base";
import { appInfo } from "../config/appInfo";
import { oAuthProviders } from "../config/oAuthProviders";

export const goRecipeImports = {
    emailPassword: 'import "github.com/supertokens/supertokens-golang/recipe/emailpassword"',
    thirdParty: `import (
    "github.com/supertokens/supertokens-golang/recipe/thirdparty"
    "github.com/supertokens/supertokens-golang/recipe/thirdparty/tpmodels"
)`,
    passwordless: `import (
    "github.com/supertokens/supertokens-golang/recipe/passwordless"
    "github.com/supertokens/supertokens-golang/recipe/passwordless/plessmodels"
)`,
    session: 'import "github.com/supertokens/supertokens-golang/recipe/session"',
    dashboard: 'import "github.com/supertokens/supertokens-golang/recipe/dashboard"',
    userRoles: 'import "github.com/supertokens/supertokens-golang/recipe/userroles"',
    multiFactorAuth: `import (
    "github.com/supertokens/supertokens-golang/recipe/multifactorauth"
    "github.com/supertokens/supertokens-golang/recipe/multifactorauth/mfamodels"
)`,
    accountLinking: `import (
    "github.com/supertokens/supertokens-golang/recipe/accountlinking"
    "github.com/supertokens/supertokens-golang/recipe/accountlinking/almodels"
)`,
    emailVerification: `import (
    "github.com/supertokens/supertokens-golang/recipe/emailverification"
    "github.com/supertokens/supertokens-golang/recipe/emailverification/evmodels"
)`,
    totp: `import (
    "github.com/supertokens/supertokens-golang/recipe/totp"
    "github.com/supertokens/supertokens-golang/recipe/totp/totpmodels"
)`,
};

export const goBaseTemplate = `
package main

import (
    "fmt"
    "os"
    "github.com/supertokens/supertokens-golang/supertokens"
)

func getStringPointer(s string) *string {
    return &s
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
}`;

export const goRecipeInits = {
    emailPassword: () => `emailpassword.Init(nil)`,
    thirdParty: (providers?: OAuthProvider[]) => `thirdparty.Init(&tpmodels.TypeInput{
    SignInAndUpFeature: tpmodels.TypeInputSignInAndUp{
        Providers: []tpmodels.ProviderInput{
            ${(providers || [])
                .map(
                    (p) => `{
                Config: tpmodels.ProviderConfig{
                    ThirdPartyId: "${p.id}",
                    Clients: []tpmodels.ProviderClientConfig{
                        {
                            ClientID: "${p.clientId}",
                            ClientSecret: "${p.clientSecret}",
                        },
                    },
                },
            }`
                )
                .join(",\n            ")}
        },
    },
})`,
    passwordless: () => `passwordless.Init(plessmodels.TypeInput{
    FlowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
    ContactMethodEmailOrPhone: plessmodels.ContactMethodEmailOrPhoneConfig{
        Enabled: true,
    },
})`,
    session: () => `session.Init(nil)`,
    dashboard: () => `dashboard.Init(nil)`,
    userRoles: () => `userroles.Init(nil)`,
    multiFactorAuth: () => `multifactorauth.Init(&mfamodels.TypeInput{
    FirstFactors: []string{"thirdparty", "emailpassword"},
})`,
    accountLinking: () => `accountlinking.Init(&almodels.TypeInput{
    ShouldDoAutomaticAccountLinking: func() (bool, bool) {
        return true, true
    },
})`,
    emailVerification: () => `emailverification.Init(evmodels.TypeInput{
    Mode: evmodels.ModeRequired,
})`,
    totp: () => `totp.Init(&totpmodels.TypeInput{})`,
};

export const generateGoTemplate = (configType: ConfigType): string => {
    let template = goBaseTemplate;
    const recipes = configToRecipes[configType];

    // Add recipe-specific imports
    const imports = recipes
        .map((recipe) => goRecipeImports[recipe])
        .filter(Boolean)
        .join("\n");
    template = imports + "\n" + template;

    // Add configuration
    template += `

// SuperTokensConfig is the configuration for SuperTokens core with all auth methods
var SuperTokensConfig = supertokens.TypeInput{
    Supertokens: &supertokens.ConnectionInfo{
        ConnectionURI: "${config.connectionURI}",
    },
    AppInfo: supertokens.AppInfo{
        AppName:         "${appInfo.appName}",
        APIDomain:       getApiDomain(),
        WebsiteDomain:   getWebsiteDomain(),
        APIBasePath:     getStringPointer("${appInfo.apiBasePath}"),
        WebsiteBasePath: getStringPointer("${appInfo.websiteBasePath}"),
    },
    RecipeList: []supertokens.Recipe{
        ${recipes
            .map((recipe) => {
                if (recipe === "thirdParty") {
                    return goRecipeInits[recipe](oAuthProviders);
                }
                return goRecipeInits[recipe]();
            })
            .join(",\n        ")}
    },
}`;

    return template;
};

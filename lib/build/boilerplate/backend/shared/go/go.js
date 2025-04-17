import { configToRecipes } from "../../../../lib/ts/templateBuilder/constants.js"; // Added .js
import { config } from "../../../shared/config/base.js"; // Added .js
import { getAppInfo } from "../../../shared/config/appInfo.js"; // Added .js
import { thirdPartyLoginProviders } from "../../../backend/shared/config/oAuthProviders.js"; // Added .js
export const goRecipeImports = {
    emailPassword: `"github.com/supertokens/supertokens-golang/recipe/emailpassword"`,
    thirdParty: `"github.com/supertokens/supertokens-golang/recipe/thirdparty"
    "github.com/supertokens/supertokens-golang/recipe/thirdparty/tpmodels"`,
    passwordless: `"github.com/supertokens/supertokens-golang/recipe/passwordless"
    "github.com/supertokens/supertokens-golang/recipe/passwordless/plessmodels"`,
    session: `"github.com/supertokens/supertokens-golang/recipe/session"`,
    dashboard: `"github.com/supertokens/supertokens-golang/recipe/dashboard"`,
    userRoles: `"github.com/supertokens/supertokens-golang/recipe/userroles"`,
    accountLinking: `"github.com/supertokens/supertokens-golang/recipe/accountlinking"
    "github.com/supertokens/supertokens-golang/recipe/accountlinking/almodels"`,
    emailVerification: `"github.com/supertokens/supertokens-golang/recipe/emailverification"
    "github.com/supertokens/supertokens-golang/recipe/emailverification/evmodels"`,
    multitenancy: `"github.com/supertokens/supertokens-golang/recipe/multitenancy"
    "github.com/supertokens/supertokens-golang/recipe/multitenancy/mtmodels"`,
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
    apiPort := os.Getenv("API_PORT")
    if apiPort == "" {
        apiPort = "%DEFAULT_API_PORT%"
    }
    apiUrl := os.Getenv("API_URL")
    if apiUrl == "" {
        apiUrl = fmt.Sprintf("http://localhost:%s", apiPort)
    }
    return apiUrl
}

func getWebsiteDomain() string {
    websitePort := os.Getenv("WEBSITE_PORT")
    if websitePort == "" {
        websitePort = "%DEFAULT_WEBSITE_PORT%"
    }
    websiteUrl := os.Getenv("WEBSITE_URL")
    if websiteUrl == "" {
        websiteUrl = fmt.Sprintf("http://localhost:%s", websitePort)
    }
    return websiteUrl
}`;
export const goRecipeInits = {
    emailPassword: () => `emailpassword.Init(nil)`,
    thirdParty: (providers) => {
        if (!providers || providers.length === 0) {
            return `thirdparty.Init(nil)`;
        }
        return `thirdparty.Init(&tpmodels.TypeInput{
    SignInAndUpFeature: tpmodels.TypeInputSignInAndUp{
        Providers: []tpmodels.ProviderInput{
            ${providers
                .map(
                    (p) => `{
                Config: tpmodels.ProviderConfig{
                    ThirdPartyId: "${p.id}",
                    Clients: []tpmodels.ProviderClientConfig{
                        {
                            ClientID:     "${p.clientId}",
                            ClientSecret: "${p.clientSecret}",${
                        p.additionalConfig
                            ? `
                            AdditionalConfig: map[string]interface{}{
                                ${Object.entries(p.additionalConfig)
                                    .map(([key, value]) => {
                                        const escapedValue =
                                            typeof value === "string" ? value.replace(/\n/g, "\\n") : value;
                                        return `"${key}":     "${escapedValue}",`;
                                    })
                                    .join("\n                                ")}
                            },`
                            : ""
                    }
                        },
                    },
                },
            }`
                )
                .join(",\n            ")},
        },
    },
})`;
    },
    passwordless: (userArguments) => {
        let flowType = "USER_INPUT_CODE_AND_MAGIC_LINK";
        const hasLinkEmail =
            userArguments?.firstfactors?.includes("link-email") || userArguments?.secondfactors?.includes("link-email");
        const hasLinkPhone =
            userArguments?.firstfactors?.includes("link-phone") || userArguments?.secondfactors?.includes("link-phone");
        const hasOtpEmail =
            userArguments?.firstfactors?.includes("otp-email") || userArguments?.secondfactors?.includes("otp-email");
        const hasOtpPhone =
            userArguments?.firstfactors?.includes("otp-phone") || userArguments?.secondfactors?.includes("otp-phone");
        const hasLinkFactors = hasLinkEmail || hasLinkPhone;
        const hasOtpFactors = hasOtpEmail || hasOtpPhone;
        if (hasLinkFactors && hasOtpFactors) {
            flowType = "USER_INPUT_CODE_AND_MAGIC_LINK";
        } else if (hasLinkFactors) {
            flowType = "MAGIC_LINK";
        } else if (hasOtpFactors) {
            flowType = "USER_INPUT_CODE";
        }
        return `passwordless.Init(plessmodels.TypeInput{
    FlowType: "${flowType}",
    ContactMethodEmailOrPhone: plessmodels.ContactMethodEmailOrPhoneConfig{
        Enabled: true,
    },
})`;
    },
    session: () => `session.Init(nil)`,
    dashboard: () => `dashboard.Init(nil)`,
    userRoles: () => `userroles.Init(nil)`,
    accountLinking: () => `accountlinking.Init(&almodels.TypeInput{
    ShouldDoAutomaticAccountLinking: func() (bool, bool) {
        return true, true
    },
})`,
    emailVerification: () => `emailverification.Init(&evmodels.TypeInput{
    Mode: evmodels.ModeRequired,
})`,
    multitenancy: () => `multitenancy.Init(nil)`,
};
export const generateGoTemplate = ({ configType, userArguments }) => {
    let template = "";
    const recipes = configToRecipes[configType].filter((recipe) => recipe !== "multiFactorAuth" && recipe !== "totp"); // Added type
    const needsEmailVerification = false;
    if (needsEmailVerification && !recipes.includes("emailVerification")) {
        recipes.push("emailVerification");
    }
    const appInfo = getAppInfo();
    const imports = recipes
        .map((recipe) => goRecipeImports[recipe]) // Added type
        .filter(Boolean)
        .join("\n    ");
    template = `package main

import (
    "fmt"
    "os"
    "github.com/supertokens/supertokens-golang/supertokens"
    ${imports}
)

func getStringPointer(s string) *string {
    return &s
}

func getApiDomain() string {
    apiPort := "${appInfo.defaultApiPort}"
    apiUrl := fmt.Sprintf("http://localhost:%s", apiPort)
    return apiUrl
}

func getWebsiteDomain() string {
    websitePort := "${appInfo.defaultWebsitePort}"
    websiteUrl := fmt.Sprintf("http://localhost:%s", websitePort)
    return websiteUrl
}

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
                // Added type
                if (recipe === "thirdParty") {
                    const providersToUse = userArguments?.providers
                        ? thirdPartyLoginProviders.filter((p) => userArguments.providers.includes(p.id)) // Added type
                        : thirdPartyLoginProviders;
                    return goRecipeInits[recipe](providersToUse);
                }
                if (recipe === "passwordless") {
                    return goRecipeInits[recipe](userArguments);
                }
                return goRecipeInits[recipe]();
            })
            .join(",\n        ")},
    },
}`;
    return template;
};
export const goMainTemplate = `package main

import (
    "encoding/json"
    "net/http"
    "strings"

    "github.com/supertokens/supertokens-golang/recipe/multitenancy"
    "github.com/supertokens/supertokens-golang/recipe/session"
    "github.com/supertokens/supertokens-golang/supertokens"
)

func main() {
    err := supertokens.Init(SuperTokensConfig)

    if err != nil {
        panic(err.Error())
    }

    http.ListenAndServe(":3001", corsMiddleware(
        supertokens.Middleware(http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
            path := strings.TrimSuffix(r.URL.Path, "/")

            if path == "/hello" && r.Method == "GET" {
                hello(rw, r)
                return
            }

            if path == "/sessioninfo" {
                session.VerifySession(nil, sessioninfo).ServeHTTP(rw, r)
                return
            }

            if path == "/tenants" && r.Method == "GET" {
                tenants(rw, r)
                return
            }

            rw.WriteHeader(404)
        }))))
}

func corsMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(response http.ResponseWriter, r *http.Request) {
        response.Header().Set("Access-Control-Allow-Origin", getWebsiteDomain())
        response.Header().Set("Access-Control-Allow-Credentials", "true")
        if r.Method == "OPTIONS" {
            response.Header().Set("Access-Control-Allow-Headers", strings.Join(append([]string{"Content-Type"}, supertokens.GetAllCORSHeaders()...), ","))
            response.Header().Set("Access-Control-Allow-Methods", "*")
            response.Write([]byte(""))
        } else {
            next.ServeHTTP(response, r)
        }
    })
}

func hello(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("hello"))
}

func sessioninfo(w http.ResponseWriter, r *http.Request) {
    sessionContainer := session.GetSessionFromRequestContext(r.Context())

    if sessionContainer == nil {
        w.WriteHeader(500)
        w.Write([]byte("no session found"))
        return
    }
    sessionData, err := sessionContainer.GetSessionDataInDatabase()
    if err != nil {
        err = supertokens.ErrorHandler(err, r, w)
        if err != nil {
            w.WriteHeader(500)
            w.Write([]byte(err.Error()))
        }
        return
    }
    w.WriteHeader(200)
    w.Header().Add("content-type", "application/json")
    bytes, err := json.Marshal(map[string]interface{}{
        "sessionHandle":      sessionContainer.GetHandle(),
        "userId":            sessionContainer.GetUserID(),
        "accessTokenPayload": sessionContainer.GetAccessTokenPayload(),
        "sessionData":       sessionData,
    })
    if err != nil {
        w.WriteHeader(500)
        w.Write([]byte("error in converting to json"))
    } else {
        w.Write(bytes)
    }
}

func tenants(w http.ResponseWriter, r *http.Request) {
    tenantsList, err := multitenancy.ListAllTenants()

    if err != nil {
        err = supertokens.ErrorHandler(err, r, w)
        if err != nil {
            w.WriteHeader(500)
            w.Write([]byte(err.Error()))
        }
        return
    }

    w.WriteHeader(200)
    w.Header().Add("content-type", "application/json")

    bytes, err := json.Marshal(map[string]interface{}{
        "status": "OK",
        "tenants": tenantsList.OK.Tenants,
    })

    if err != nil {
        w.WriteHeader(500)
        w.Write([]byte("error in converting to json"))
    } else {
        w.Write(bytes)
    }
}`;

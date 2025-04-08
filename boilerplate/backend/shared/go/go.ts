import { type OAuthProvider, type ConfigType } from "../../../../lib/ts/templateBuilder/types";
import { configToRecipes } from "../../../../lib/ts/templateBuilder/constants";
import { config } from "../../../shared/config/base";
import { getAppInfo } from "../../../shared/config/appInfo";
import { thirdPartyLoginProviders } from "../../../backend/shared/config/oAuthProviders";
import { UserFlags } from "../../../../lib/ts/types";

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
    apiPort := os.Getenv("API_PORT") // Use generic env var name
    if apiPort == "" {
        apiPort = "%DEFAULT_API_PORT%" // Placeholder for default port
    }
    apiUrl := os.Getenv("API_URL") // Use generic env var name
    if apiUrl == "" {
        apiUrl = fmt.Sprintf("http://localhost:%s", apiPort)
    }
    return apiUrl
}

func getWebsiteDomain() string {
    websitePort := os.Getenv("WEBSITE_PORT") // Use generic env var name
    if websitePort == "" {
        websitePort = "%DEFAULT_WEBSITE_PORT%" // Placeholder for default port
    }
    websiteUrl := os.Getenv("WEBSITE_URL") // Use generic env var name
    if websiteUrl == "" {
        websiteUrl = fmt.Sprintf("http://localhost:%s", websitePort)
    }
    return websiteUrl
}`;

export const goRecipeInits = {
    emailPassword: () => `emailpassword.Init(nil)`,
    thirdParty: (providers?: OAuthProvider[]) => {
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
                            // IMPORTANT: Override this with your client secret in production. Use environment variables.
                            ClientSecret: "${p.clientSecret}",${
                        p.additionalConfig
                            ? `
                            AdditionalConfig: map[string]interface{}{
                                ${Object.entries(p.additionalConfig)
                                    .map(([key, value]) => {
                                        // Escape newlines in the value if it's a string
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
    passwordless: (userArguments?: UserFlags) => {
        // Determine flow type based on user arguments
        let flowType = "USER_INPUT_CODE_AND_MAGIC_LINK";

        const hasLinkEmail =
            userArguments?.firstfactors?.includes("link-email") || userArguments?.secondfactors?.includes("link-email");
        const hasLinkPhone =
            userArguments?.firstfactors?.includes("link-phone") || userArguments?.secondfactors?.includes("link-phone");
        const hasOtpEmail =
            userArguments?.firstfactors?.includes("otp-email") || userArguments?.secondfactors?.includes("otp-email");
        const hasOtpPhone =
            userArguments?.firstfactors?.includes("otp-phone") || userArguments?.secondfactors?.includes("otp-phone");

        // Determine flow type
        // Note: According to the documentation, if both OTP and magic link factors are present,
        // the flowType should be "USER_INPUT_CODE_AND_MAGIC_LINK"
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

export const generateGoTemplate = ({
    configType,
    userArguments,
}: {
    configType: ConfigType;
    userArguments?: UserFlags;
}): string => {
    let template = "";
    // Note: The Go SDK doesn't support MFA, so we filter out MFA-related recipes
    const recipes = configToRecipes[configType].filter((recipe) => recipe !== "multiFactorAuth" && recipe !== "totp");

    // Go SDK doesn't support MFA, so we'll skip that

    // If we're using link-email or email OTP as a second factor, we need email verification
    const needsEmailVerification = false; // No MFA support in Go

    // Add email verification if needed and not already included
    if (needsEmailVerification && !recipes.includes("emailVerification")) {
        recipes.push("emailVerification");
    }

    const appInfo = getAppInfo();

    // recipes array is already filtered on line 162, no need for supportedRecipes

    // Add recipe-specific imports
    const imports = recipes
        .map((recipe) => goRecipeImports[recipe as keyof typeof goRecipeImports]) // Use recipes directly, keep assertion
        .filter(Boolean)
        .join("\n    ");

    // Add package declaration and imports
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
    apiPort := "${appInfo.defaultApiPort}" // Use appInfo default directly
    apiUrl := fmt.Sprintf("http://localhost:%s", apiPort)
    return apiUrl
}

func getWebsiteDomain() string {
    websitePort := "${appInfo.defaultWebsitePort}" // Use appInfo default directly
    websiteUrl := fmt.Sprintf("http://localhost:%s", websitePort)
    return websiteUrl
}

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
        ${recipes // Use recipes directly here
            .map((recipe) => {
                if (recipe === "thirdParty") {
                    // Filter providers if the user specified them via CLI flag
                    const providersToUse = userArguments?.providers
                        ? thirdPartyLoginProviders.filter((p) => userArguments.providers!.includes(p.id))
                        : thirdPartyLoginProviders;
                    return goRecipeInits[recipe](providersToUse);
                }
                if (recipe === "passwordless") {
                    return goRecipeInits[recipe](userArguments);
                }
                // We know recipe is a valid key here because recipes is filtered on line 162
                return goRecipeInits[recipe as keyof typeof goRecipeInits]();
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
            // Handle your APIs..
            path := strings.TrimSuffix(r.URL.Path, "/")

            // A public endpoint unprotected by SuperTokens
            if path == "/hello" && r.Method == "GET" {
                hello(rw, r)
                return
            }

            // A SuperTokens protected endpoint that returns
            // session information
            if path == "/sessioninfo" {
                session.VerifySession(nil, sessioninfo).ServeHTTP(rw, r)
                return
            }

            // An endpoint that returns tenant lists in a
            // multitenant configuration
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

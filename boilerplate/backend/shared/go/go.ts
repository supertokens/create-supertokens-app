import { type OAuthProvider, type ConfigType } from "../../../../lib/ts/templateBuilder/types.js";
import { configToRecipes } from "../../../../lib/ts/templateBuilder/constants.js";
import { config } from "../../../shared/config/base.js";
import { getAppInfo } from "../../../shared/config/appInfo.js";
import { thirdPartyLoginProviders } from "../../../backend/shared/config/oAuthProviders.js";
import { UserFlags } from "../../../../lib/ts/types.js";

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
    passwordless: (userArguments?: UserFlags) => {
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

        // Determine which contact methods are being used
        const hasEmailFactors = hasLinkEmail || hasOtpEmail;
        const hasPhoneFactors = hasLinkPhone || hasOtpPhone;

        if (hasLinkFactors && hasOtpFactors) {
            flowType = "USER_INPUT_CODE_AND_MAGIC_LINK";
        } else if (hasLinkFactors) {
            flowType = "MAGIC_LINK";
        } else if (hasOtpFactors) {
            flowType = "USER_INPUT_CODE";
        }

        // Determine the appropriate contact method configuration
        let contactMethodConfig = "";
        if (hasEmailFactors && hasPhoneFactors) {
            contactMethodConfig = `ContactMethodEmailOrPhone: plessmodels.ContactMethodEmailOrPhoneConfig{
        Enabled: true,
    },`;
        } else if (hasEmailFactors) {
            contactMethodConfig = `ContactMethodEmail: plessmodels.ContactMethodEmailConfig{
        Enabled: true,
    },`;
        } else if (hasPhoneFactors) {
            contactMethodConfig = `ContactMethodPhone: plessmodels.ContactMethodPhoneConfig{
        Enabled: true,
    },`;
        } else {
            // Default to email if no specific factors are selected
            contactMethodConfig = `ContactMethodEmail: plessmodels.ContactMethodEmailConfig{
        Enabled: true,
    },`;
        }

        let testConf = "";
        if (process.env.TEST_MODE === "testing") {
            testConf = `,
            GetCustomUserInputCode: func(userContext any) (string, error) {
                return "123456", nil
            },`;
        }

        return `passwordless.Init(plessmodels.TypeInput{
    FlowType: "${flowType}",
    ${contactMethodConfig}${testConf}
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
    emailVerification: () => `emailverification.Init(evmodels.TypeInput{
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
    // Check if MFA or TOTP is requested, as they're not supported in Go
    if (
        configType === "multifactorauth" ||
        userArguments?.secondfactors?.length ||
        configToRecipes[configType].includes("multiFactorAuth") ||
        configToRecipes[configType].includes("totp")
    ) {
        throw new Error(
            "Multi-factor authentication is not currently supported with the Go SDK. Please use a different backend or recipe."
        );
    }

    let template = "";
    // Filter out recipes not initialized via RecipeList in Go
    const recipes = configToRecipes[configType].filter(
        (recipe: string) =>
            recipe !== "accountLinking" && // accountLinking is used directly, not via init list
            recipe !== "multitenancy" // multitenancy is used directly, not via init list
    );

    // emailVerification is already included in recipes when needed via configToRecipes

    const appInfo = getAppInfo();

    const imports = recipes
        .map((recipe: string) => goRecipeImports[recipe as keyof typeof goRecipeImports])
        .filter(Boolean)
        .join("\n    ");

    template = `package main

import (
    "fmt"
    // "os" // Keep os commented out as it's not used here
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
            .map((recipe: string) => {
                if (recipe === "thirdParty") {
                    const providersToUse = userArguments?.providers
                        ? thirdPartyLoginProviders.filter((p: OAuthProvider) => userArguments.providers!.includes(p.id))
                        : thirdPartyLoginProviders;
                    return goRecipeInits[recipe](providersToUse);
                }
                if (recipe === "passwordless") {
                    return goRecipeInits[recipe](userArguments);
                }
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
            response.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH") // Explicitly list methods
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

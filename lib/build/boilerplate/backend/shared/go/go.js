import { configToRecipes } from "../../../../lib/ts/templateBuilder/constants.js";
import { getAppConfig } from "../../../shared/config/appInfo.js";
import { thirdPartyLoginProviders } from "../../../backend/shared/config/oAuthProviders.js";
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
    const recipes = configToRecipes[configType].filter((recipe) => recipe !== "multiFactorAuth" && recipe !== "totp");
    const needsEmailVerification = false;
    if (needsEmailVerification && !recipes.includes("emailVerification")) {
        recipes.push("emailVerification");
    }
    const appConfig = getAppConfig(false, userArguments);
    const imports = recipes
        .map((recipe) => goRecipeImports[recipe])
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
    apiPort := "${appConfig.appInfo.defaultApiPort}"
    apiUrl := "${appConfig.appInfo.apiDomain}"
    return apiUrl
}

func getWebsiteDomain() string {
    websitePort := "${appConfig.appInfo.defaultWebsitePort}"
    websiteUrl := "${appConfig.appInfo.websiteDomain}"
    return websiteUrl
}

var SuperTokensConfig = supertokens.TypeInput{
    Supertokens: &supertokens.ConnectionInfo{
        ConnectionURI: "${appConfig.supertokens.connectionURI}",
    },
    AppInfo: supertokens.AppInfo{
        AppName:         "${appConfig.appInfo.appName}",
        APIDomain:       getApiDomain(),
        WebsiteDomain:   getWebsiteDomain(),
        APIBasePath:     getStringPointer("${appConfig.appInfo.apiBasePath}"),
        WebsiteBasePath: getStringPointer("${appConfig.appInfo.websiteBasePath}"),
    },
    RecipeList: []supertokens.Recipe{
        ${recipes
            .map((recipe) => {
                if (recipe === "thirdParty") {
                    const providersToUse = userArguments?.providers
                        ? thirdPartyLoginProviders.filter((p) => userArguments.providers.includes(p.id))
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

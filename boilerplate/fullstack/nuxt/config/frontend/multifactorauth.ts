import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";
import EmailVerification from "supertokens-web-js/recipe/emailverification";
import MultiFactorAuth from "supertokens-web-js/recipe/multifactorauth";
import { appInfo } from "./appInfo";

export function initSuperTokensUI() {
    (window as any).supertokensUIInit("supertokensui", {
        appInfo,
        recipeList: [
            (window as any).supertokensUIEmailPassword.init(),
            (window as any).supertokensUIThirdParty.init({
                signInAndUpFeature: {
                    providers: [
                        (window as any).supertokensUIThirdParty.Github.init(),
                        (window as any).supertokensUIThirdParty.Google.init(),
                        (window as any).supertokensUIThirdParty.Apple.init(),
                        (window as any).supertokensUIThirdParty.Twitter.init(),
                    ],
                },
            }),
            (window as any).supertokensUIPasswordless.init({
                contactMethod: "EMAIL_OR_PHONE",
            }),
            (window as any).supertokensUIEmailVerification.init({
                mode: "REQUIRED",
            }),
            (window as any).supertokensUIMultiFactorAuth.init({
                firstFactors: ["thirdparty", "emailpassword"],
            }),
            (window as any).supertokensUITOTP.init(),
            (window as any).supertokensUISession.init(),
        ],
    });
}

export function initSuperTokensWebJS() {
    SuperTokens.init({
        appInfo,
        recipeList: [Session.init(), EmailVerification.init(), MultiFactorAuth.init()],
    });
}

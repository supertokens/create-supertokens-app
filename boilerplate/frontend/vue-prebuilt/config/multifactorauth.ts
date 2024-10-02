import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";
import EmailVerification from "supertokens-web-js/recipe/emailverification";
import MultiFactorAuth from "supertokens-web-js/recipe/multifactorauth";

const api_port = import.meta.env.VITE_API_PORT || 3001;
const app_port = import.meta.env.VITE_APP_PORT || 3000;

export function initSuperTokensUI() {
  (window as any).supertokensUIInit("supertokensui", {
    appInfo: {
      websiteDomain: `http://localhost:${app_port}`,
      apiDomain: `http://localhost:${api_port}`,
      appName: "SuperTokens Demo App",
    },
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
    appInfo: {
      appName: "SuperTokens Demo App",
      apiDomain: `http://localhost:${api_port}`,
    },
    recipeList: [
      Session.init(),
      EmailVerification.init(),
      MultiFactorAuth.init(),
    ],
  });
}

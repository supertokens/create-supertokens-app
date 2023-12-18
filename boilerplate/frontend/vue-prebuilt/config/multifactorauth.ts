import ThirdPartyEmailPassword, {
  Github,
  Google,
  Apple,
  Twitter,
} from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import Session from "supertokens-auth-react/recipe/session";
import MultiFactorAuth from "supertokens-auth-react/recipe/multifactorauth";
import TOTP from "supertokens-auth-react/recipe/totp";

export const SuperTokensConfig = {
  appInfo: {
    appName: "SuperTokens Demo App",
    apiDomain: "http://localhost:3001",
    websiteDomain: "http://localhost:3000",
  },
  recipeList: [
    ThirdPartyEmailPassword.init({
      useShadowDom: false,
      signInAndUpFeature: {
        providers: [Github.init(), Google.init(), Apple.init(), Twitter.init()],
      },
    }),
    MultiFactorAuth.init(),
    TOTP.init(),
    Session.init(),
  ],
};

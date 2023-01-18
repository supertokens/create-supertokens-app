import ThirdPartyEmailPassword, {
  Github,
  Google,
  Apple,
} from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import Session from "supertokens-auth-react/recipe/session";

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
        providers: [Github.init(), Google.init(), Apple.init()],
      },
    }),
    Session.init(),
  ],
};
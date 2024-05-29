import ThirdParty, {
  Github,
  Google,
  Apple,
  Twitter,
} from "supertokens-auth-react/recipe/thirdparty";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";

export const SuperTokensConfig = {
  appInfo: {
    appName: "SuperTokens Demo App",
    apiDomain: "http://localhost:3001",
    websiteDomain: "http://localhost:3000",
  },
  useShadowDom: false,
  recipeList: [
    EmailPassword.init(),
    ThirdParty.init({
      signInAndUpFeature: {
        providers: [Github.init(), Google.init(), Apple.init(), Twitter.init()],
      },
    }),
    Session.init(),
  ],
};

import ThirdParty from "supertokens-auth-react/recipe/thirdparty";
import Passwordless from "supertokens-auth-react/recipe/passwordless";
import {
  Github,
  Google,
  Apple,
  Twitter,
} from "supertokens-auth-react/recipe/thirdparty";
import Session from "supertokens-auth-react/recipe/session";

export const SuperTokensConfig = {
  appInfo: {
    appName: "SuperTokens Demo App",
    apiDomain: "http://localhost:3001",
    websiteDomain: "http://localhost:3000",
  },
  useShadowDom: false,
  recipeList: [
    ThirdParty.init({
      signInAndUpFeature: {
        providers: [Github.init(), Google.init(), Apple.init(), Twitter.init()],
      },
    }),
    Passwordless.init({
      contactMethod: "EMAIL_OR_PHONE",
    }),
    Session.init(),
  ],
};

import ThirdPartyPasswordless from "supertokens-auth-react/recipe/thirdpartypasswordless";
import {
  Github,
  Google,
  Apple,
} from "supertokens-auth-react/recipe/thirdpartypasswordless";
import Session from "supertokens-auth-react/recipe/session";

export const SuperTokensConfig = {
  appInfo: {
    appName: "SuperTokens Demo App",
    apiDomain: "http://localhost:3001",
    websiteDomain: "http://localhost:3000",
  },
  recipeList: [
    ThirdPartyPasswordless.init({
      useShadowDom: false,
      signInUpFeature: {
        providers: [Github.init(), Google.init(), Apple.init()],
      },
      contactMethod: "EMAIL_OR_PHONE",
    }),
    Session.init(),
  ],
};

import ThirdParty, {
  Github,
  Google,
  Apple,
} from "supertokens-auth-react/recipe/thirdparty";
import { ThirdPartyPreBuiltUI } from "supertokens-auth-react/recipe/thirdparty/prebuiltui";
import Session from "supertokens-auth-react/recipe/session";

export const SuperTokensConfig = {
  appInfo: {
    appName: "SuperTokens Demo App",
    apiDomain: "http://localhost:3001",
    websiteDomain: "http://localhost:3000",
  },
  recipeList: [
    ThirdParty.init({
      useShadowDom: false,
      signInAndUpFeature: {
        providers: [Github.init(), Google.init(), Apple.init()],
      },
    }),
    Session.init(),
  ],
};

export const PreBuiltUIList = [ThirdPartyPreBuiltUI];
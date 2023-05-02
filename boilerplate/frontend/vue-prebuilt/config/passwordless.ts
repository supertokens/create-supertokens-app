import Passwordless from "supertokens-auth-react/recipe/passwordless";
import { PasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/passwordless/prebuiltui";
import Session from "supertokens-auth-react/recipe/session";

export const SuperTokensConfig = {
  appInfo: {
    appName: "SuperTokens Demo App",
    apiDomain: "http://localhost:3001",
    websiteDomain: "http://localhost:3000",
  },
  recipeList: [
    Passwordless.init({
      useShadowDom: false,
      contactMethod: "EMAIL_OR_PHONE",
    }),
    Session.init(),
  ],
};

export const PreBuiltUIList = [PasswordlessPreBuiltUI];
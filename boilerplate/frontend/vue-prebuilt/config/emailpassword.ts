import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";

export const SuperTokensConfig = {
  appInfo: {
    appName: "SuperTokens Demo App",
    apiDomain: "http://localhost:3001",
    websiteDomain: "http://localhost:3000",
  },
  recipeList: [
    EmailPassword.init({
      useShadowDom: false,
    }),
    Session.init(),
  ],
};

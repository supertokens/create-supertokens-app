import ThirdParty from 'supertokens-node/recipe/thirdparty';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Passwordless from 'supertokens-node/recipe/passwordless';
import Session from 'supertokens-node/recipe/session';
import Dashboard from 'supertokens-node/recipe/dashboard';
import UserRoles from 'supertokens-node/recipe/userroles';

export function getApiDomain() {
  const apiPort =
    process.env.REACT_APP_API_PORT || process.env.VITE_API_PORT || 3001;
  const apiUrl = process.env.REACT_APP_API_URL || `http://localhost:${apiPort}`;
  return apiUrl;
}

export function getWebsiteDomain() {
  const websitePort = process.env.VITE_APP_PORT || process.env.PORT || 3000;
  const websiteUrl =
    process.env.REACT_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
  return websiteUrl;
}

export const appInfo = {
  // Learn more about this on https://supertokens.com/docs/thirdpartypasswordless/appInfo
  appName: 'Supertokens Demo App',
  apiDomain: getApiDomain(),
  websiteDomain: getWebsiteDomain(),
  apiBasePath: '/auth',
  websiteBasePath: '/auth',
};

export const connectionUri = 'https://try.supertokens.com';

export const recipeList = [
  EmailPassword.init(),
  ThirdParty.init(),
  Passwordless.init({
    contactMethod: 'EMAIL',
    flowType: 'USER_INPUT_CODE_AND_MAGIC_LINK',
  }),
  Session.init(),
  Dashboard.init(),
  UserRoles.init(),
];

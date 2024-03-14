import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';
import ThirdPartyPasswordless from 'supertokens-node/recipe/thirdpartypasswordless';
import Session from 'supertokens-node/recipe/session';
import Dashboard from 'supertokens-node/recipe/dashboard';
import UserRoles from 'supertokens-node/recipe/userroles';

export const appInfo = {
  // Learn more about this on https://supertokens.com/docs/thirdpartypasswordless/appInfo
  appName: 'ST',
  apiDomain: 'http://localhost:3001',
  websiteDomain: 'http://localhost:3000',
  apiBasePath: '/auth',
  websiteBasePath: '/auth',
};

export const connectionUri = 'http://localhost:3567';

export const recipeList = [
  ThirdPartyEmailPassword.init(),
  ThirdPartyPasswordless.init({
    contactMethod: 'EMAIL',
    flowType: 'USER_INPUT_CODE_AND_MAGIC_LINK',
  }),
  Session.init(),
  Dashboard.init(),
  UserRoles.init(),
];

import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';
import Session from 'supertokens-node/recipe/session';
import Dashboard from 'supertokens-node/recipe/dashboard';

export const appInfo = {
  // Learn more about this on https://supertokens.com/docs/thirdpartypasswordless/appinfo
  appName: 'ST',
  apiDomain: 'http://localhost:3001',
  websiteDomain: 'http://localhost:3000',
  apiBasePath: '/auth',
  websiteBasePath: '/auth',
};

export const connectionUri = 'https://try.supertokens.com';

export const recipeList = [
  ThirdPartyEmailPassword.init({
    providers: [
      // We have provided you with development keys which you can use for testing.
      // IMPORTANT: Please replace them with your own OAuth keys for production use.
      ThirdPartyEmailPassword.Google({
        clientId:
          '1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com',
        clientSecret: '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',
      }),
      ThirdPartyEmailPassword.Github({
        clientSecret: 'e97051221f4b6426e8fe8d51486396703012f5bd',
        clientId: '467101b197249757c71f',
      }),
      ThirdPartyEmailPassword.Apple({
        clientId: '4398792-io.supertokens.example.service',
        clientSecret: {
          keyId: '7M48Y4RYDL',
          privateKey:
            '-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----',
          teamId: 'YWQCXGJRJL',
        },
      }),
    ],
  }),
  Session.init(),
  Dashboard.init({
    apiKey: 'supertokens_is_awesome',
  }),
];

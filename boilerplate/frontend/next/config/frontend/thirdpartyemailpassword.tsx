import ThirdPartyEmailPasswordReact, {redirectToAuth as _redirectToAuth} from 'supertokens-auth-react/recipe/thirdpartyemailpassword'
import SessionReact from 'supertokens-auth-react/recipe/session'
import { appInfo } from './appInfo'
import Router from 'next/router'

export let frontendConfig = () => {
  return {
    appInfo,
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
      ThirdPartyEmailPasswordReact.init({
        emailVerificationFeature: {
          mode: 'REQUIRED',
        },
        signInAndUpFeature: {
          providers: [
            ThirdPartyEmailPasswordReact.Google.init(),
            ThirdPartyEmailPasswordReact.Github.init(),
            ThirdPartyEmailPasswordReact.Apple.init(),
          ],
        },
      }),
      SessionReact.init(),
    ],
    // this is so that the SDK uses the next router for navigation
    windowHandler: (oI) => {
      return {
        ...oI,
        location: {
          ...oI.location,
          setHref: (href) => {
            Router.push(href)
          },
        },
      }
    },
  }
}

export const redirectToAuth = _redirectToAuth;

export const AuthWrapper = ThirdPartyEmailPasswordReact.ThirdPartyEmailPasswordAuth;
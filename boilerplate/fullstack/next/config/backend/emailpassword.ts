import EmailPasswordNode from 'supertokens-node/recipe/emailpassword'
import SessionNode from 'supertokens-node/recipe/session'
import { appInfo } from './appInfo'
import { AuthConfig } from '../interfaces'

export let backendConfig = (): AuthConfig => {
  return {
    framework: 'express',
    supertokens: {
      connectionURI: 'https://try.supertokens.io',
    },
    appInfo,
    recipeList: [
        EmailPasswordNode.init(),
        SessionNode.init(),
    ],
    isInServerlessEnv: true,
  }
}

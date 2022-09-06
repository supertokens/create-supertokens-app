import PasswordlessNode from 'supertokens-node/recipe/passwordless'
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
        PasswordlessNode.init({
            contactMethod: "EMAIL_OR_PHONE",
            flowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
        }),
        SessionNode.init(),
    ],
    isInServerlessEnv: true,
  }
}

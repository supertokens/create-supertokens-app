import { appInfo } from './appInfo'
import { AuthConfig } from '../interfaces'

export let backendConfig = (): AuthConfig => {
  return {
    framework: 'express',
    supertokens: {
      connectionURI: 'https://try.supertokens.io',
    },
    appInfo,
    recipeList: [],
    isInServerlessEnv: true,
  }
}

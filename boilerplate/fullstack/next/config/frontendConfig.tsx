import { appInfo } from './appInfo'

export let frontendConfig = () => {
  return {
    appInfo,
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [],
  }
}

export const redirectToAuth = () => {};

export const AuthWrapper: React.FC<any> = (props: any) => {
  return (
      <div>
          {props.children}
      </div>
  );
};

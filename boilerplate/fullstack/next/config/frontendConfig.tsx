import { appInfo } from './appInfo'

export let frontendConfig = () => {
  return {
    appInfo,
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

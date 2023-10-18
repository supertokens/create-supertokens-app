
import PasswordlessReact from "supertokens-auth-react/recipe/passwordless";
  import Session from "supertokens-auth-react/recipe/session";
  import { appInfo } from "./appinfo";
  import { useRouter } from "next/navigation";
  import { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";
  import { PasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/passwordless/prebuiltui";
  
  const routerInfo: { router?: ReturnType<typeof useRouter>; pathName?: string } =
    {};
  
  export function setRouter(
    router: ReturnType<typeof useRouter>,
    pathName: string
  ) {
    routerInfo.router = router;
    routerInfo.pathName = pathName;
  }
  
  export const frontendConfig = (): SuperTokensConfig => {
    return {
      appInfo,
      recipeList: [
        PasswordlessReact.init({
            contactMethod: "EMAIL_OR_PHONE",
        }),
        Session.init(),
      ],
      windowHandler: (orig) => {
        return {
          ...orig,
          location: {
            ...orig.location,
            getPathName: () => routerInfo.pathName!,
            assign: (url) => routerInfo.router!.push(url.toString()),
            setHref: (url) => routerInfo.router!.push(url.toString()),
          },
        };
      },
    };
  };
  
  export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/thirdpartyemailpassword/introduction",
  };

  export const PreBuiltUIList = [PasswordlessPreBuiltUI];

import ThirdPartyReact from "supertokens-auth-react/recipe/thirdparty";
  import Session from "supertokens-auth-react/recipe/session";
  import { appInfo } from "./appinfo";
  import { useRouter } from "next/navigation";
  import { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";
  import { ThirdPartyPreBuiltUI } from "supertokens-auth-react/recipe/thirdparty/prebuiltui";
  
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
        ThirdPartyReact.init({
            signInAndUpFeature: {
                providers: [
                    ThirdPartyReact.Google.init(),
                    ThirdPartyReact.Github.init(),
                    ThirdPartyReact.Apple.init(),
                ],
            },
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

  export const PreBuiltUIList = [ThirdPartyPreBuiltUI];
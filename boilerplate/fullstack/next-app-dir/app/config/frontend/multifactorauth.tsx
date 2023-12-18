import ThirdPartyPasswordlessReact from "supertokens-auth-react/recipe/thirdpartypasswordless";
import MultiFactorAuthReact from "supertokens-auth-react/recipe/multifactorauth";
import TOTPReact from "supertokens-auth-react/recipe/totp";
import Session from "supertokens-auth-react/recipe/session";
import { appInfo } from "./appInfo";
import { useRouter } from "next/navigation";
import { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";
import { ThirdPartyPasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/thirdpartypasswordless/prebuiltui";
import { MultiFactorAuthPreBuiltUI } from "supertokens-auth-react/recipe/multifactorauth/prebuiltui";
import { TOTPPreBuiltUI } from "supertokens-auth-react/recipe/totp/prebuiltui";

const routerInfo: { router?: ReturnType<typeof useRouter>; pathName?: string } = {};

export function setRouter(router: ReturnType<typeof useRouter>, pathName: string) {
    routerInfo.router = router;
    routerInfo.pathName = pathName;
}

export const frontendConfig = (): SuperTokensConfig => {
    return {
        appInfo,
        recipeList: [
            ThirdPartyPasswordlessReact.init({
                signInUpFeature: {
                    providers: [
                        ThirdPartyPasswordlessReact.Github.init(),
                        ThirdPartyPasswordlessReact.Google.init(),
                        ThirdPartyPasswordlessReact.Apple.init(),
                    ],
                },
                contactMethod: "EMAIL_OR_PHONE",
            }),
            MultiFactorAuthReact.init(),
            TOTPReact.init(),
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
    docsLink: "https://supertokens.com/docs/thirdpartypasswordless/introduction",
};

export const PreBuiltUIList = [ThirdPartyPasswordlessPreBuiltUI, MultiFactorAuthPreBuiltUI, TOTPPreBuiltUI];

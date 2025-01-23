import ThirdPartyReact from "supertokens-auth-react/recipe/thirdparty";
import EmailPasswordReact from "supertokens-auth-react/recipe/emailpassword";
import MultiFactorAuthReact from "supertokens-auth-react/recipe/multifactorauth";
import EmailVerification from "supertokens-auth-react/recipe/emailverification";
import PasswordlessReact from "supertokens-auth-react/recipe/passwordless";
import TOTPReact from "supertokens-auth-react/recipe/totp";
import Session from "supertokens-auth-react/recipe/session";
import { appInfo } from "./appInfo";
import { useRouter } from "next/navigation";
import { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";
import { ThirdPartyPreBuiltUI } from "supertokens-auth-react/recipe/thirdparty/prebuiltui";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import { MultiFactorAuthPreBuiltUI } from "supertokens-auth-react/recipe/multifactorauth/prebuiltui";
import { EmailVerificationPreBuiltUI } from "supertokens-auth-react/recipe/emailverification/prebuiltui";
import { TOTPPreBuiltUI } from "supertokens-auth-react/recipe/totp/prebuiltui";
import { PasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/passwordless/prebuiltui";

const routerInfo: { router?: ReturnType<typeof useRouter>; pathName?: string } = {};

export function setRouter(router: ReturnType<typeof useRouter>, pathName: string) {
    routerInfo.router = router;
    routerInfo.pathName = pathName;
}

export const frontendConfig = (): SuperTokensConfig => {
    return {
        appInfo,
        recipeList: [
            EmailPasswordReact.init(),
            ThirdPartyReact.init({
                signInAndUpFeature: {
                    providers: [
                        ThirdPartyReact.Google.init(),
                        ThirdPartyReact.Github.init(),
                        ThirdPartyReact.Apple.init(),
                    ],
                },
            }),
            PasswordlessReact.init({
                contactMethod: "EMAIL_OR_PHONE",
            }),
            EmailVerification.init({ mode: "REQUIRED" }),
            MultiFactorAuthReact.init({ firstFactors: ["thirdparty", "emailpassword"] }),
            TOTPReact.init(),
            Session.init(),
        ],
        getRedirectionURL: async (context: any) => {
            if (context.action === "SUCCESS") {
                return "/dashboard";
            }
            return undefined;
        },
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
    docsLink: "https://supertokens.com/docs/mfa/introduction",
};

export const PreBuiltUIList = [
    ThirdPartyPreBuiltUI,
    EmailPasswordPreBuiltUI,
    PasswordlessPreBuiltUI,
    MultiFactorAuthPreBuiltUI,
    EmailVerificationPreBuiltUI,
    TOTPPreBuiltUI,
];

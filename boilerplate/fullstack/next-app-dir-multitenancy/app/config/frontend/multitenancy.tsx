import ThirdPartyReact from "supertokens-auth-react/recipe/thirdparty";
import EmailPasswordReact from "supertokens-auth-react/recipe/emailpassword";
import PasswordlessReact from "supertokens-auth-react/recipe/passwordless";
import MultitenancyReact from "supertokens-auth-react/recipe/multitenancy";
import Session from "supertokens-auth-react/recipe/session";
import { appInfo } from "./appInfo";
import { useRouter } from "next/navigation";
import { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";
import { ThirdPartyPreBuiltUI } from "supertokens-auth-react/recipe/thirdparty/prebuiltui";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import { PasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/passwordless/prebuiltui";

const routerInfo: { router?: ReturnType<typeof useRouter>; pathName?: string } = {};

export function setRouter(router: ReturnType<typeof useRouter>, pathName: string) {
    routerInfo.router = router;
    routerInfo.pathName = pathName;
}

export const styleOverride = `
[data-supertokens~=tenants-link] {
    margin-top: 8px;
}
`;

export const frontendConfig = (): SuperTokensConfig => {
    return {
        appInfo,
        style: styleOverride,
        usesDynamicLoginMethods: true,
        // recipeList contains all the modules that you want to
        // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
        recipeList: [
            PasswordlessReact.init({
                contactMethod: "EMAIL",
            }),
            EmailPasswordReact.init(),
            ThirdPartyReact.init(),
            Session.init(),
            MultitenancyReact.init({
                override: {
                    functions: (oI) => {
                        return {
                            ...oI,
                            getTenantId: async () => {
                                const tenantIdInStorage = localStorage.getItem("tenantId");
                                return tenantIdInStorage === null ? undefined : tenantIdInStorage;
                            },
                        };
                    },
                },
            }),
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
    docsLink: "https://supertokens.com/docs/multitenancy/introduction",
};

export const PreBuiltUIList = [EmailPasswordPreBuiltUI, ThirdPartyPreBuiltUI, PasswordlessPreBuiltUI];

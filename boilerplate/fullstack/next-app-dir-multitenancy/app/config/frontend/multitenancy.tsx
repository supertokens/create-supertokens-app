import ThirdPartyEmailPasswordReact from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import ThirdPartyPasswordlessReact from "supertokens-auth-react/recipe/thirdpartypasswordless";
import MultitenancyReact from "supertokens-auth-react/recipe/multitenancy";
import Session from "supertokens-auth-react/recipe/session";
import { appInfo } from "./appInfo";
import { useRouter } from "next/navigation";
import { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";
import { ThirdPartyEmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/thirdpartyemailpassword/prebuiltui";
import { ThirdPartyPasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/thirdpartypasswordless/prebuiltui";

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
        usesDynamicLoginMethods: true,
        // recipeList contains all the modules that you want to
        // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
        recipeList: [
            ThirdPartyPasswordlessReact.init({
                contactMethod: "EMAIL",
                style: styleOverride,
            }),
            ThirdPartyEmailPasswordReact.init({
                style: styleOverride,
            }),
            Session.init({
                onHandleEvent: (event) => {
                    // This is done to remove the saved tenantId so that when the user next
                    // visits the login page, they see the tenant drop down.
                    if (["SIGN_OUT", "UNAUTHORISED", "SESSION_CREATED"].includes(event.action)) {
                        localStorage.removeItem("tenantId");
                    }
                },
            }),
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

export const PreBuiltUIList = [ThirdPartyEmailPasswordPreBuiltUI, ThirdPartyPasswordlessPreBuiltUI];

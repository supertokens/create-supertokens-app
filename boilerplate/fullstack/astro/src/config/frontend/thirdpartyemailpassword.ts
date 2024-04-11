import ThirdPartyEmailPasswordReact from "supertokens-auth-react/recipe/thirdpartyemailpassword/index.js";
import Session from "supertokens-auth-react/recipe/session/index.js";
import { appInfo } from "./appInfo";
import { ThirdPartyEmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/thirdpartyemailpassword/prebuiltui.js";

export const frontendConfig = () => {
    return {
        appInfo,
        recipeList: [
            ThirdPartyEmailPasswordReact.init({
                signInAndUpFeature: {
                    providers: [
                        ThirdPartyEmailPasswordReact.Google.init(),
                        ThirdPartyEmailPasswordReact.Github.init(),
                        ThirdPartyEmailPasswordReact.Apple.init(),
                    ],
                },
            }),
            Session.init(),
        ],
    };
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/thirdpartyemailpassword/introduction",
};

export const PreBuiltUIList = [ThirdPartyEmailPasswordPreBuiltUI];

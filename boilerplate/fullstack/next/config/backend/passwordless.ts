import PasswordlessNode from "supertokens-node/recipe/passwordless";
import SessionNode from "supertokens-node/recipe/session";
import Dashboard from "supertokens-node/recipe/dashboard";
import { appInfo } from "./appInfo";
import { AuthConfig } from "../interfaces";

export let backendConfig = (): AuthConfig => {
    return {
        framework: "express",
        supertokens: {
            // this is the location of the SuperTokens core.
            connectionURI: "https://try.supertokens.com",
        },
        appInfo,
        // recipeList contains all the modules that you want to
        // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
        recipeList: [
            PasswordlessNode.init({
                contactMethod: "EMAIL_OR_PHONE",
                flowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
            }),
            SessionNode.init(),
            Dashboard.init({
                apiKey: "supertokens_is_awesome",
            }),
        ],
        isInServerlessEnv: true,
    };
};

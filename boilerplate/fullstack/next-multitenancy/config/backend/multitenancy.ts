import ThirdPartyNode from "supertokens-node/recipe/thirdparty";
import EmailPasswordNode from "supertokens-node/recipe/emailpassword";
import PasswordlessNode from "supertokens-node/recipe/passwordless";
import SessionNode from "supertokens-node/recipe/session";
import Dashboard from "supertokens-node/recipe/dashboard";
import UserRoles from "supertokens-node/recipe/userroles";
import { TypeInput } from "supertokens-node/types";
import { appInfo } from "./appInfo";

export let backendConfig = (): TypeInput => {
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
            ThirdPartyNode.init(),
            EmailPasswordNode.init(),
            PasswordlessNode.init({
                contactMethod: "EMAIL",
                flowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
            }),
            SessionNode.init(),
            Dashboard.init(),
            UserRoles.init(),
        ],
        isInServerlessEnv: true,
    };
};

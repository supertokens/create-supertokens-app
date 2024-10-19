import ThirdParty from "supertokens-node/recipe/thirdparty";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Passwordless from "supertokens-node/recipe/passwordless";
import Session from "supertokens-node/recipe/session";
import { TypeInput } from "supertokens-node/types";
import Dashboard from "supertokens-node/recipe/dashboard";
import MultiFactorAuth from "supertokens-node/recipe/multifactorauth";
import EmailVerification from "supertokens-node/recipe/emailverification";
import TOTP from "supertokens-node/recipe/totp";
import UserRoles from "supertokens-node/recipe/userroles";
import { appInfo } from "./appInfo";
import SuperTokens from "supertokens-node";

export let backendConfig = (): TypeInput => {
    return {
        supertokens: {
            // this is the location of the SuperTokens core.
            connectionURI: "https://try.supertokens.com/appid-demo-dashboard",
            apiKey: process.env.API_KEY,
        },
        appInfo,
        // recipeList contains all the modules that you want to
        // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
        recipeList: [
            EmailPassword.init(),
            ThirdParty.init(),
            Passwordless.init({
                contactMethod: "EMAIL_OR_PHONE",
                flowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
            }),
            Session.init(),
            Dashboard.init({
                admins: ["rishabh@supertokens.com"],
            }),
            UserRoles.init(),
            TOTP.init(),
            MultiFactorAuth.init(),
            EmailVerification.init({
                mode: "OPTIONAL",
            }),
        ],
        isInServerlessEnv: true,
        framework: "custom",
    };
};

let initialized = false;
export function ensureSuperTokensInit() {
    if (!initialized) {
        SuperTokens.init(backendConfig());
        initialized = true;
    }
}

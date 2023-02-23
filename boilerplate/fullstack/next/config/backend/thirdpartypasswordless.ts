import ThirdPartyPasswordlessNode from "supertokens-node/recipe/thirdpartypasswordless";
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
            ThirdPartyPasswordlessNode.init({
                providers: [
                    // We have provided you with development keys which you can use for testing.
                    // IMPORTANT: Please replace them with your own OAuth keys for production use.
                    ThirdPartyPasswordlessNode.Google({
                        clientId: "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
                        clientSecret: "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",
                    }),
                    ThirdPartyPasswordlessNode.Github({
                        clientSecret: "e97051221f4b6426e8fe8d51486396703012f5bd",
                        clientId: "467101b197249757c71f",
                    }),
                    ThirdPartyPasswordlessNode.Apple({
                        clientId: "4398792-io.supertokens.example.service",
                        clientSecret: {
                            keyId: "7M48Y4RYDL",
                            privateKey:
                                "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
                            teamId: "YWQCXGJRJL",
                        },
                    }),
                ],
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

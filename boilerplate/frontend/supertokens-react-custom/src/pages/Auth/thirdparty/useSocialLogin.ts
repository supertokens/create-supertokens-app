import { getWebsiteDomain } from "@/config";
import { getAuthorisationURLWithQueryParamsAndSetState } from "supertokens-web-js/recipe/thirdparty";
import STGeneralError from "supertokens-web-js/utils/error";
import { signInAndUp } from "supertokens-web-js/recipe/thirdparty";

type SocialLoginResponse =
    | {
          status: "success";
          redirectTo: string;
      }
    | {
          status: "failure";
          reason: string;
      };

type CallBackResponse = {
    status: "success" | "failure";
    message: string;
};

const useSocialLogin = () => {
    const handleSocialLogin = async (thirdPartyId: string): Promise<SocialLoginResponse> => {
        try {
            const authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
                thirdPartyId,
                frontendRedirectURI: `${getWebsiteDomain()}/authenticate/callback/google`,
            });

            return {
                status: "success",
                redirectTo: authUrl,
            };
        } catch (err: unknown) {
            if ((err as STGeneralError).isSuperTokensGeneralError === true) {
                return {
                    status: "failure",
                    reason: (err as STGeneralError).message,
                };
            }
            return {
                status: "failure",
                reason: "Oops! Something went wrong.",
            };
        }
    };
    const handleCallbackResponse = async (): Promise<CallBackResponse> => {
        try {
            const response = await signInAndUp();

            if (response.status === "OK") {
                if (response.createdNewRecipeUser && response.user.loginMethods.length === 1) {
                    return {
                        status: "success",
                        message: "Account created successfully",
                    };
                }
                return {
                    status: "success",
                    message: "Logged in successfully",
                };
            } else if (response.status === "SIGN_IN_UP_NOT_ALLOWED") {
                // the reason string is a user friendly message
                // about what went wrong. It can also contain a support code which users
                // can tell you so you know why their sign in / up was not allowed.
                return {
                    status: "failure",
                    message: response.reason,
                };
            } else {
                // SuperTokens requires that the third party provider
                // gives an email for the user. If that's not the case, sign up / in
                // will fail.

                // As a hack to solve this, you can override the backend functions to create a fake email for the user.

                return {
                    status: "failure",
                    message: "No email provided by social login. Please use another form of login",
                };
            }
        } catch (err: unknown) {
            if ((err as STGeneralError).isSuperTokensGeneralError === true) {
                return {
                    status: "failure",
                    message: (err as STGeneralError).message,
                };
            }
            return {
                status: "failure",
                message: "Oops! Something went wrong.",
            };
        }
    };
    return {
        socialLogin: handleSocialLogin,
        callbackHandler: handleCallbackResponse,
    };
};

export default useSocialLogin;

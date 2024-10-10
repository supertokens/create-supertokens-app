import { createCode, resendCode, clearLoginAttemptInfo, consumeCode } from "supertokens-web-js/recipe/passwordless";
import STGeneralError from "supertokens-web-js/utils/error";

interface SendOTPResponse {
    status: "success" | "failure";
    reason: string;
}

type ResendOTPResponse = SendOTPResponse;

type SubmitOTPResponse = { reason: string } & (
    | { status: "success" }
    | { status: "failure"; redirectBackToLogin: boolean }
);

const useLogin = () => {
    const handleResendOTP = async (): Promise<ResendOTPResponse> => {
        try {
            const response = await resendCode();

            if (response.status === "RESTART_FLOW_ERROR") {
                // this can happen if the user has already successfully logged in into
                // another device whilst also trying to login to this one.

                // we clear the login attempt info that was added when the createCode function
                // was called - so that if the user does a page reload, they will now see the
                // enter email / phone UI again.
                await clearLoginAttemptInfo();
                return {
                    status: "failure",
                    reason: "Login failed. Please try again",
                };
            }
            return {
                status: "success",
                reason: "",
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
    const handleSendOTP = async (email: string): Promise<SendOTPResponse> => {
        try {
            const response = await createCode({
                email,
            });
            /**
       * For phone number, use this:

          let response = await createPasswordlessCode({
              phoneNumber: "+1234567890"
          });

      */

            if (response.status === "SIGN_IN_UP_NOT_ALLOWED") {
                // the reason string is a user friendly message
                // about what went wrong. It can also contain a support code which users
                // can tell you so you know why their sign in / up was not allowed.
                return {
                    status: "failure",
                    reason: response.reason,
                };
            }
            return {
                status: "success",
                reason: "",
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
    const handleSubmitOTP = async (otp: string): Promise<SubmitOTPResponse> => {
        try {
            const response = await consumeCode({
                userInputCode: otp,
            });

            if (response.status === "OK") {
                // we clear the login attempt info that was added when the createCode function
                // was called since the login was successful.
                await clearLoginAttemptInfo();
                if (response.createdNewRecipeUser && response.user.loginMethods.length === 1) {
                    return {
                        status: "success",
                        reason: "New User Created. Please Link your email and password",
                    };
                }
                return {
                    status: "success",
                    reason: "",
                };
            } else if (response.status === "INCORRECT_USER_INPUT_CODE_ERROR") {
                return {
                    status: "failure",
                    reason:
                        "Wrong OTP! Please try again. Number of attempts left: " +
                        (response.maximumCodeInputAttempts - response.failedCodeInputAttemptCount),
                    redirectBackToLogin: false,
                };
            } else if (response.status === "EXPIRED_USER_INPUT_CODE_ERROR") {
                return {
                    status: "failure",
                    reason: "Old OTP entered. Please regenerate a new one and try again",
                    redirectBackToLogin: false,
                };
            } else {
                // this can happen if the user tried an incorrect OTP too many times.
                // or if it was denied due to security reasons in case of automatic account linking

                // we clear the login attempt info that was added when the createCode function
                // was called - so that if the user does a page reload, they will now see the
                // enter email / phone UI again.
                await clearLoginAttemptInfo();
                return {
                    status: "failure",
                    reason: "Login failed. Please try again",
                    redirectBackToLogin: true,
                };
            }
        } catch (err: unknown) {
            if ((err as STGeneralError).isSuperTokensGeneralError === true) {
                return {
                    status: "failure",
                    reason: (err as STGeneralError).message,
                    redirectBackToLogin: true,
                };
            }
            return {
                status: "failure",
                reason: "Oops! Something went wrong.",
                redirectBackToLogin: true,
            };
        }
    };
    return {
        resendOTP: handleResendOTP,
        sendOTP: handleSendOTP,
        submitOTP: handleSubmitOTP,
    };
};

export default useLogin;

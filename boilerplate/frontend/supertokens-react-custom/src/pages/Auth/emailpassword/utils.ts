import { signIn, signUp } from "supertokens-web-js/recipe/emailpassword";
import STGeneralError from "supertokens-web-js/utils/error";

type RegistrationResponse = {
    status: "success" | "failure";
    reason: string;
};

type LoginResponse = {
    status: "success" | "failure";
    reason: string;
};

const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await signIn({
            formFields: [
                {
                    id: "email",
                    value: email,
                },
                {
                    id: "password",
                    value: password,
                },
            ],
        });

        if (response.status === "FIELD_ERROR") {
            for (const formField of response.formFields) {
                return {
                    status: "failure",
                    reason: formField.error,
                };
            }
        } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
            return {
                status: "failure",
                reason: "Email password combination is incorrect.",
            };
        } else if (response.status === "SIGN_IN_NOT_ALLOWED") {
            return {
                status: "failure",
                reason: response.reason,
            };
        } else {
            return {
                status: "success",
                reason: "",
            };
        }
    } catch (err: unknown) {
        if ((err as STGeneralError)?.isSuperTokensGeneralError === true) {
            // this may be a custom error message sent from the API by you.
            return {
                status: "failure",
                reason: (err as STGeneralError).message,
            };
        } else {
            return {
                status: "failure",
                reason: "Oops! Something went wrong.",
            };
        }
    }
    return {
        status: "failure",
        reason: "Unhandled error.",
    };
};

const register = async (email: string, password: string): Promise<RegistrationResponse> => {
    try {
        const response = await signUp({
            formFields: [
                {
                    id: "email",
                    value: email,
                },
                {
                    id: "password",
                    value: password,
                },
            ],
        });

        if (response.status === "FIELD_ERROR") {
            for (const formField of response.formFields) {
                return {
                    status: "failure",
                    reason: formField.error,
                };
            }
        } else if (response.status === "SIGN_UP_NOT_ALLOWED") {
            return {
                status: "failure",
                reason: response.reason,
            };
        } else {
            return {
                status: "success",
                reason: "",
            };
        }
    } catch (err: unknown) {
        if ((err as STGeneralError)?.isSuperTokensGeneralError === true) {
            // this may be a custom error message sent from the API by you.
            return {
                status: "failure",
                reason: (err as STGeneralError).message,
            };
        } else {
            return {
                status: "failure",
                reason: "Oops! Something went wrong.",
            };
        }
    }
    return {
        status: "failure",
        reason: "Unhandled error.",
    };
};

export { login, register };

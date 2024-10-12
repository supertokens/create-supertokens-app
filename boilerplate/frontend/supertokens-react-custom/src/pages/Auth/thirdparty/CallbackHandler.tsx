import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import STGeneralError from "supertokens-web-js/utils/error";
import { signInAndUp } from "supertokens-web-js/recipe/thirdparty";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";

function CallbackHandler() {
    const alreadyExecuted = useRef(false);
    const navigate = useNavigate();
    useEffect(() => {
        async function handleCallback() {
            try {
                const response = await signInAndUp();

                if (response.status === "OK") {
                    if (response.createdNewRecipeUser && response.user.loginMethods.length === 1) {
                        toast.success("Account created successfully");
                    } else {
                        toast.success("Logged in successfully");
                    }
                    navigate("/dashboard");
                    return;
                } else if (response.status === "SIGN_IN_UP_NOT_ALLOWED") {
                    // the reason string is a user friendly message
                    // about what went wrong. It can also contain a support code which users
                    // can tell you so you know why their sign in / up was not allowed.
                    throw new Error(response.reason);
                } else {
                    // SuperTokens requires that the third party provider
                    // gives an email for the user. If that's not the case, sign up / in
                    // will fail.

                    // As a hack to solve this, you can override the backend functions to create a fake email for the user.

                    throw new Error("No email provided by social login. Please use another form of login");
                }
            } catch (error: unknown) {
                console.error(error);
                const errorMessage = (error as STGeneralError | Error)?.message || "Oops! Something went wrong.";
                toast.error(errorMessage);
                navigate("/authenticate");
            }
        }
        if (!alreadyExecuted.current) {
            handleCallback();
            alreadyExecuted.current = true;
        }
    }, []);
    return <Spinner />;
}

export default CallbackHandler;

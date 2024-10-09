import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCode, resendCode, clearLoginAttemptInfo, consumeCode } from "supertokens-auth-react/recipe/passwordless";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [showResend, setShowResend] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const handleResend = async () => {
        try {
            const response = await resendCode();

            if (response.status === "RESTART_FLOW_ERROR") {
                // this can happen if the user has already successfully logged in into
                // another device whilst also trying to login to this one.

                // we clear the login attempt info that was added when the createCode function
                // was called - so that if the user does a page reload, they will now see the
                // enter email / phone UI again.
                await clearLoginAttemptInfo();
                window.alert("Login failed. Please try again");
                window.location.assign("/auth");
            } else {
                // OTP resent successfully.
                window.alert("Please check your email for the OTP");
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (err.isSuperTokensGeneralError === true) {
                // this may be a custom error message sent from the API by you.
                window.alert(err.message);
            } else {
                window.alert("Oops! Something went wrong.");
            }
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!showOtp) {
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
                    window.alert(response.reason);
                } else {
                    // OTP sent successfully.
                    setShowResend(true);
                    setShowOtp(true);
                    window.alert("Please check your email for an OTP");
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                if (err.isSuperTokensGeneralError === true) {
                    // this may be a custom error message sent from the API by you,
                    // or if the input email / phone number is not valid.
                    window.alert(err.message);
                } else {
                    window.alert("Oops! Something went wrong.");
                }
            }
        } else {
            try {
                const response = await consumeCode({
                    userInputCode: otp,
                });

                if (response.status === "OK") {
                    // we clear the login attempt info that was added when the createCode function
                    // was called since the login was successful.
                    await clearLoginAttemptInfo();
                    if (response.createdNewRecipeUser && response.user.loginMethods.length === 1) {
                        alert("New user created. Please sign in with your email and password to link your account");
                    } else {
                        // redirect to home page
                        navigate("/dashboard");
                    }
                    window.location.assign("/home");
                } else if (response.status === "INCORRECT_USER_INPUT_CODE_ERROR") {
                    // the user entered an invalid OTP
                    window.alert(
                        "Wrong OTP! Please try again. Number of attempts left: " +
                            (response.maximumCodeInputAttempts - response.failedCodeInputAttemptCount)
                    );
                } else if (response.status === "EXPIRED_USER_INPUT_CODE_ERROR") {
                    // it can come here if the entered OTP was correct, but has expired because
                    // it was generated too long ago.
                    window.alert("Old OTP entered. Please regenerate a new one and try again");
                } else {
                    // this can happen if the user tried an incorrect OTP too many times.
                    // or if it was denied due to security reasons in case of automatic account linking

                    // we clear the login attempt info that was added when the createCode function
                    // was called - so that if the user does a page reload, they will now see the
                    // enter email / phone UI again.
                    await clearLoginAttemptInfo();
                    setShowOtp(false);
                    setShowResend(false);
                }
            } catch (err: any) {
                if (err.isSuperTokensGeneralError === true) {
                    // this may be a custom error message sent from the API by you.
                    window.alert(err.message);
                } else {
                    window.alert("Oops! Something went wrong.");
                }
            }
        }
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                {!showOtp && (
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                )}
                {showOtp && (
                    <input type="number" placeholder="Otp" value={otp} onChange={(e) => setOtp(e.target.value)} />
                )}
                <button type="submit">Sign In</button>
                {showResend && <button onClick={handleResend}>Resend</button>}
            </form>
        </div>
    );
}

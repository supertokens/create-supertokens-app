import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Spinner from "@/components/Spinner";
import useSessionInfo from "@/hooks/useSessionInfo";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createCode, resendCode, clearLoginAttemptInfo, consumeCode } from "supertokens-web-js/recipe/passwordless";
import STGeneralError from "supertokens-web-js/utils/error";

enum SCREEN {
    EMAIL,
    OTP,
}

interface PasswordlessSignInProps {
    showHeader?: boolean;
    showFooter?: boolean;
    rootStyle?: React.CSSProperties;
}

export default function PasswordlessSignIn({
    showFooter = true,
    showHeader = true,
    rootStyle,
}: PasswordlessSignInProps) {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [screen, setScreen] = useState<SCREEN>(SCREEN.EMAIL);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigate();
    const { sessionExists } = useSessionInfo();

    const handleResendOTP = async () => {
        setIsLoading(true);
        try {
            const response = await resendCode();

            if (response.status === "RESTART_FLOW_ERROR") {
                // this can happen if the user has already successfully logged in into
                // another device whilst also trying to login to this one.

                // we clear the login attempt info that was added when the createCode function
                // was called - so that if the user does a page reload, they will now see the
                // enter email / phone UI again.
                await clearLoginAttemptInfo();
                toast.error("Login failed. Please try again");
                return;
            }
            toast.success("OTP Resent Successfully");
            return;
        } catch (error) {
            console.error(error);
            const errorMessage = (error as STGeneralError | Error)?.message || "Oops! Something went wrong.";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            /**
             * Email Screen
             */
            if (screen === SCREEN.EMAIL) {
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
                    throw new Error(response.reason);
                }
                setScreen(SCREEN.OTP);
                toast.success("OTP Sent Successfully");
                return;
            }

            /**
             * OTP Screen
             */
            const response = await consumeCode({
                userInputCode: otp,
            });

            if (response.status === "OK") {
                // we clear the login attempt info that was added when the createCode function
                // was called since the login was successful.
                await clearLoginAttemptInfo();
                if (response.createdNewRecipeUser && response.user.loginMethods.length === 1) {
                    toast.success("New User Created. Please Link your email and password");
                } else {
                    toast.success("Logged In Successfully");
                }
                navigation("/dashboard");
                return;
            } else if (response.status === "INCORRECT_USER_INPUT_CODE_ERROR") {
                throw new Error(
                    "Wrong OTP! Please try again. Number of attempts left: " +
                        (response.maximumCodeInputAttempts - response.failedCodeInputAttemptCount)
                );
            } else if (response.status === "EXPIRED_USER_INPUT_CODE_ERROR") {
                throw new Error("Old OTP entered. Please regenerate a new one and try again");
            } else {
                // this can happen if the user tried an incorrect OTP too many times.
                // or if it was denied due to security reasons in case of automatic account linking

                // we clear the login attempt info that was added when the createCode function
                // was called - so that if the user does a page reload, they will now see the
                // enter email / phone UI again.
                await clearLoginAttemptInfo();
                setScreen(SCREEN.EMAIL);
                throw new Error("Login failed. Please try again");
            }
        } catch (error: unknown) {
            console.error(error);
            const errorMessage = (error as STGeneralError | Error)?.message || "Oops! Something went wrong.";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (!sessionExists.isLoading && sessionExists.isLoggedIn) {
            navigation("/dashboard");
        }
    }, [sessionExists]);

    if (sessionExists.isLoading) {
        return <Spinner />;
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center my-10" style={rootStyle}>
            <div>
                {showHeader && <Header />}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col 300 p-10 rounded-md gap-8 bg-gradient-to-r from-golden-bell-500 via-golden-bell-300 to-golden-bell-500"
                >
                    {screen === SCREEN.EMAIL && (
                        <label className="text-black font-bold flex flex-col gap-1">
                            Email
                            <Input
                                placeholder="Enter your email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </label>
                    )}
                    {screen === SCREEN.OTP && (
                        <label className="text-black font-bold flex flex-col gap-1">
                            OTP
                            <Input
                                placeholder="Enter the OTP Received"
                                type="number"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </label>
                    )}
                    <button
                        type="submit"
                        className="bg-golden-bell-700 text-white px-5 py-2 rounded-md min-w-32 hover:bg-golden-bell-600 transition-all
              disabled:bg-golden-bell-100 disabled:text-golden-bell-400 disabled:cursor-not-allowed
            "
                        disabled={isLoading}
                    >
                        {screen === SCREEN.EMAIL ? "Send OTP" : "Verify OTP"}
                    </button>
                    {screen === SCREEN.OTP && (
                        <span className="text-[12px] text-center">
                            Haven't Received the OTP yet?{" "}
                            <button
                                className="outline border-0 outline-none underline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleResendOTP();
                                }}
                                type="button"
                            >
                                Resend
                            </button>
                        </span>
                    )}
                </form>
            </div>
            {showFooter && <Footer title="Passwordless React Demo App" />}
        </div>
    );
}

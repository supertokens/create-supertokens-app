import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Input from "@/components/Input";
import useSessionInfo from "@/hooks/useSessionInfo";
import { useEffect, useState } from "react";
import { submitOTP, resendOTP, sendOTP } from "./utils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
        const response = await resendOTP();
        setIsLoading(false);
        if (response.status === "success") {
            toast.success("OTP Resent Successfully");
            return;
        }
        toast.error(response.reason);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        if (screen === SCREEN.EMAIL) {
            const response = await sendOTP(email);
            setIsLoading(false);
            if (response.status === "success") {
                setScreen(SCREEN.OTP);
                toast.success("OTP Sent Successfully");
                return;
            }
            toast.error(response.reason);
            return;
        }
        const response = await submitOTP(otp);
        setIsLoading(false);
        if (response.status === "success") {
            toast.success("Logged In Successfully");
            navigation("/dashboard");
            return;
        }
        toast.error(response.reason);
        if (response.redirectBackToLogin) {
            setOtp("");
            setScreen(SCREEN.EMAIL);
        }
    };
    useEffect(() => {
        if (sessionExists) {
            navigation("/dashboard");
        }
    }, [sessionExists]);

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
                            <button className="outline border-0 outline-none underline" onClick={handleResendOTP}>
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

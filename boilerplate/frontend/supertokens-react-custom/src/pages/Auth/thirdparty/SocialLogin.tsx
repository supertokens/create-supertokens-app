import Footer from "@/components/Footer";
import Header from "@/components/Header";
import useSessionInfo from "@/hooks/useSessionInfo";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SUPPORTED_PROVIDERS } from "./constants";
import useSocialLogin from "./useSocialLogin";
import { toast } from "react-toastify";

interface SocialLoginProps {
    showHeader?: boolean;
    showFooter?: boolean;
    rootStyle?: React.CSSProperties;
    view?: "full" | "compact";
}

export default function SocialLogin({
    showFooter = true,
    showHeader = true,
    rootStyle,
    view = "full",
}: SocialLoginProps) {
    const { sessionExists } = useSessionInfo();
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigate();
    const { socialLogin } = useSocialLogin();

    const handleLoginRequest = async (provider: string) => {
        setIsLoading(true);
        const response = await socialLogin(provider);
        if (response.status === "success") {
            window.location.assign(response.redirectTo);
            return;
        }
        toast.error(response.reason);
        setIsLoading(false);
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
                <div
                    className={`flex gap-5 items-center justify-center ${
                        view === "full" ? "flex-col" : "max-w-[250px] flex-wrap"
                    }`}
                >
                    {SUPPORTED_PROVIDERS.map((provider, index) => (
                        <button
                            key={index}
                            className={`bg-golden-bell-700 text-white rounded-md  hover:bg-golden-bell-600 transition-all flex items-center justify-center gap-2
              disabled:bg-golden-bell-100 disabled:text-golden-bell-400 disabled:cursor-not-allowed
              ${view === "full" ? "py-2 px-5 min-w-[100%]" : "w-10 h-10 rounded-full"}
            `}
                            disabled={isLoading}
                            onClick={() => handleLoginRequest(provider.key)}
                        >
                            {provider.icon}
                            {view === "full" && `Sign In With ${provider.name}`}
                        </button>
                    ))}
                </div>
            </div>
            {showFooter && <Footer title="Thirdparty(Social) React Demo App" />}
        </div>
    );
}

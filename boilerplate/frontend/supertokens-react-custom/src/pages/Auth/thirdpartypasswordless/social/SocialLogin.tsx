import useSessionInfo from "@/hooks/useSessionInfo";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SUPPORTED_PROVIDERS } from "./constants";
import useSocialLogin from "./useSocialLogin";
import { toast } from "react-toastify";

export default function SocialLogin() {
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
        <div className="w-full h-full flex flex-col items-center justify-center my-10">
            <div>
                <div className="flex flex-col gap-5">
                    {SUPPORTED_PROVIDERS.map((provider, index) => (
                        <button
                            key={index}
                            className="bg-golden-bell-700 text-white px-5 py-2 rounded-md min-w-32 hover:bg-golden-bell-600 transition-all flex items-center justify-center gap-2
              disabled:bg-golden-bell-100 disabled:text-golden-bell-400 disabled:cursor-not-allowed
            "
                            disabled={isLoading}
                            onClick={() => handleLoginRequest(provider.key)}
                        >
                            {provider.icon}
                            Sign In With {provider.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

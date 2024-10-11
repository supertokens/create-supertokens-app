import { useEffect, useState } from "react";
import useLogin from "./useLogin";
import useRegister from "./useRegister";
import useSessionInfo from "@/hooks/useSessionInfo";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Input from "@/components/Input";
import { toast } from "react-toastify";

type AuthenticationType = "login" | "registration";
interface FormInputState {
    email: string;
    password: string;
    confirmPassword?: string;
}

const initialFormInputState: FormInputState = {
    email: "",
    password: "",
    confirmPassword: "",
};

interface LoginAndRegisterProps {
    showHeader?: boolean;
    showFooter?: boolean;
    rootStyle?: React.CSSProperties;
}

export default function LoginAndRegister({ showFooter = true, showHeader = true, rootStyle }: LoginAndRegisterProps) {
    /**
     * The authentication type state. This would be used to switch between login and registration.
     */
    const [authenticationType, setAuthenticationType] = useState<AuthenticationType>("login");

    const navigation = useNavigate();
    const [formInputState, setFormInputState] = useState<FormInputState>(initialFormInputState);
    const [isLoading, setIsLoading] = useState(false);

    const { sessionExists } = useSessionInfo();
    const { register } = useRegister();
    const { login } = useLogin();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isLoading) return;
        if (authenticationType === "registration" && formInputState.password !== formInputState.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        setIsLoading(true);
        try {
            if (authenticationType === "login") {
                const response = await login(formInputState.email, formInputState.password);
                if (response.status === "failure") {
                    toast.error(response.reason);
                    setFormInputState(initialFormInputState);
                    return;
                }
                toast.success("Login Successful");
                navigation("/dashboard");
                return;
            }
            const response = await register(formInputState.email, formInputState.password);
            if (response.status === "failure") {
                toast.error(response.reason);
                setFormInputState(initialFormInputState);
                return;
            }
            toast.success("Registration Successful. Login to continue.");
            setAuthenticationType("login");
        } catch (error) {
            console.error(error);
            toast.error("Oops! Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (sessionExists) {
            navigation("/dashboard");
        }
    }, [sessionExists]);

    useEffect(() => {
        setFormInputState(initialFormInputState);
    }, [authenticationType]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center my-10" style={rootStyle}>
            <div>
                {showHeader && <Header />}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col 300 p-10 rounded-md gap-8 bg-gradient-to-r from-golden-bell-500 via-golden-bell-300 to-golden-bell-500"
                >
                    <label className="text-black font-bold flex flex-col gap-1">
                        Email
                        <Input
                            placeholder="Email Id"
                            type="email"
                            value={formInputState.email}
                            onChange={(e) =>
                                setFormInputState({
                                    ...formInputState,
                                    email: e.target.value,
                                })
                            }
                            required
                        />
                    </label>

                    <label className="text-black font-bold flex flex-col gap-1">
                        Password
                        <Input
                            placeholder="Password"
                            type="password"
                            value={formInputState.password}
                            onChange={(e) =>
                                setFormInputState({
                                    ...formInputState,
                                    password: e.target.value,
                                })
                            }
                            required
                        />
                    </label>

                    {authenticationType === "registration" && (
                        <label className="text-black font-bold flex flex-col gap-1">
                            Confirm Password
                            <Input
                                placeholder="Confirm Password"
                                type="password"
                                value={formInputState.confirmPassword}
                                onChange={(e) =>
                                    setFormInputState({
                                        ...formInputState,
                                        confirmPassword: e.target.value,
                                    })
                                }
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
                        {authenticationType === "login" ? "Login" : "Register"}
                    </button>
                    {authenticationType === "login" && (
                        <span className="text-[12px] text-center">
                            Not yet SignedUp?{" "}
                            <button
                                className="outline border-0 outline-none underline"
                                onClick={() => setAuthenticationType("registration")}
                            >
                                Register
                            </button>
                        </span>
                    )}
                    {authenticationType === "registration" && (
                        <span className="text-[12px] text-center">
                            Already Registered?{" "}
                            <button
                                className="outline border-0 outline-none underline"
                                onClick={() => setAuthenticationType("login")}
                            >
                                Login
                            </button>
                        </span>
                    )}
                </form>
            </div>
            {showFooter && <Footer title="Email & Password React Demo App" />}
        </div>
    );
}

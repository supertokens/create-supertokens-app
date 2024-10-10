import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useSocialLogin from "./useSocialLogin";
import { toast } from "react-toastify";

function CallbackHandler() {
    const alreadyExecuted = useRef(false);
    const navigate = useNavigate();
    const { callbackHandler } = useSocialLogin();
    useEffect(() => {
        async function handleCallback() {
            const response = await callbackHandler();
            if (response.status === "success") {
                toast.success(response.message, { updateId: "callback-success" });
                navigate("/dashboard");
                return;
            }
            toast.error(response.message);
            navigate("/authenticate");
        }
        if (!alreadyExecuted.current) {
            handleCallback();
            alreadyExecuted.current = true;
        }
    }, []);
    return <div className="text-white text-4xl">loading...</div>;
}

export default CallbackHandler;

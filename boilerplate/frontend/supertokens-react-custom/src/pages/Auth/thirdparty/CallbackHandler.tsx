import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { callbackHandler } from "./utils";
import { GrYoga } from "react-icons/gr";
import { toast } from "react-toastify";

function CallbackHandler() {
    const alreadyExecuted = useRef(false);
    const navigate = useNavigate();
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
    return (
        <div className="text-white text-4xl w-full h-[100dvh] flex flex-col items-center justify-center text-center">
            <GrYoga size={125} />
            loading...
        </div>
    );
}

export default CallbackHandler;

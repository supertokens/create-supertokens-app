import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Session from "supertokens-web-js/recipe/session";

export default function Protected() {
    const [isSessionStatusLoading, setIsSessionStatusLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        async function checkSession() {
            setIsSessionStatusLoading(true);
            try {
                const isSessionValid = await Session.doesSessionExist();
                if (!isSessionValid) {
                    navigate(`/authenticate?redirectTo=${location.pathname}`);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsSessionStatusLoading(false);
            }
        }
        checkSession();
    }, []);

    if (isSessionStatusLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <Outlet />
        </div>
    );
}

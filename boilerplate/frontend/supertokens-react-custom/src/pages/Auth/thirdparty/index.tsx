import { RouteObject } from "react-router-dom";
import SocialLogin from "./SocialLogin";
import CallbackHandler from "./CallbackHandler";

const AuthRoutes: RouteObject[] = [
    {
        path: "/authenticate",
        element: <SocialLogin />,
    },
    {
        path: "/authenticate/callback/:provider",
        element: <CallbackHandler />,
    },
];

export default AuthRoutes;

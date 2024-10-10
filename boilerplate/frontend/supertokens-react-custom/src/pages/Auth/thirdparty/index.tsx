import { RouteObject } from "react-router-dom";
import SignIn from "./SignIn";
import CallbackHandler from "./CallbackHandler";

const AuthRoutes: RouteObject[] = [
    {
        path: "/signin",
        element: <SignIn />,
    },
    {
        path: "/callback/google",
        element: <CallbackHandler />,
    },
];

export default AuthRoutes;

import { RouteObject } from "react-router-dom";
import SignIn from "./SignIn";
import CallbackHandler from "./CallbackHandler";

const AuthRoutes: RouteObject[] = [
    {
        path: "social/signin",
        element: <SignIn />,
    },
    {
        path: "social/callback/google",
        element: <CallbackHandler />,
    },
];

export default AuthRoutes;

import { RouteObject } from "react-router-dom";
import SignUp from "./SignUp";
import SignIn from "./SingIn";

const AuthRoutes: RouteObject[] = [
    {
        path: "/signin",
        element: <SignIn />,
    },
    {
        path: "/signup",
        element: <SignUp />,
    },
];

export default AuthRoutes;

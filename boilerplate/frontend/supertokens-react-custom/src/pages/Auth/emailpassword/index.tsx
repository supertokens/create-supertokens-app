import { RouteObject } from "react-router-dom";
import SignUp from "./SignUp";
import SignIn from "./SingIn";

const AuthRoutes: RouteObject[] = [
    {
        path: "emailpassword/signin",
        element: <SignIn />,
    },
    {
        path: "emailpassword/signup",
        element: <SignUp />,
    },
];

export default AuthRoutes;

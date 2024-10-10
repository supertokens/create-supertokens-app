import { RouteObject } from "react-router-dom";
import PasswordlessSignIn from "./PasswordlessSignIn";

const AuthRoutes: RouteObject[] = [
    {
        path: "/authenticate",
        element: <PasswordlessSignIn />,
    },
];

export default AuthRoutes;

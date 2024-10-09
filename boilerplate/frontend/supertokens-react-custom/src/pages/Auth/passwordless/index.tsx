import { RouteObject } from "react-router-dom";
import SignIn from "./SingIn";

const AuthRoutes: RouteObject[] = [
    {
        path: "passwordless/signin",
        element: <SignIn />,
    },
];

export default AuthRoutes;

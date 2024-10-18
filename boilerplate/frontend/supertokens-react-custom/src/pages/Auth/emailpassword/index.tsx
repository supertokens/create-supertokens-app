import { RouteObject } from "react-router-dom";
import LoginAndRegister from "./LoginAndRegister";

const AuthRoutes: RouteObject[] = [
    {
        path: "/authenticate",
        element: <LoginAndRegister />,
    },
];

export default AuthRoutes;

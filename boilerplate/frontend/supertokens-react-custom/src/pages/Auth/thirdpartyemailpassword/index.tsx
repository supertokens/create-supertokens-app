import { RouteObject } from "react-router-dom";
import SocialAndEmailPassword from "./SocialAndEmailPassword";
import CallbackHandler from "./thirdparty/CallbackHandler";
const AuthRoutes: RouteObject[] = [
    {
        path: "/authenticate",
        element: <SocialAndEmailPassword />,
    },
    {
        path: "/authenticate/callback/:provider",
        element: <CallbackHandler />,
    },
];

export default AuthRoutes;

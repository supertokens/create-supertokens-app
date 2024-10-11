import { RouteObject } from "react-router-dom";
import SocialAndPasswordless from "./SocialAndPasswordless";
import CallbackHandler from "./thirdparty/CallbackHandler";
const AuthRoutes: RouteObject[] = [
    {
        path: "/authenticate",
        element: <SocialAndPasswordless />,
    },
    {
        path: "/authenticate/callback/:provider",
        element: <CallbackHandler />,
    },
];

export default AuthRoutes;

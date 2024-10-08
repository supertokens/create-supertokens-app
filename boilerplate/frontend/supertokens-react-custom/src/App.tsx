import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { SuperTokensConfig } from "@/config";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "@/pages/Home";
import AuthRoutes from "@/pages/Auth";
import DashboardPage from "@/pages/Dashboard";
import Protected from "@/auth/Protected";

SuperTokens.init(SuperTokensConfig);

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/dashboard",
        element: <Protected />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
        ],
    },
    ...AuthRoutes,
]);

function App() {
    return (
        <SuperTokensWrapper>
            <RouterProvider router={router} />
        </SuperTokensWrapper>
    );
}

export default App;

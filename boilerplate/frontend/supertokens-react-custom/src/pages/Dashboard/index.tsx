import { useNavigate } from "react-router-dom";
import { signOut } from "supertokens-web-js/recipe/session";

export default function DashboardPage() {
    return (
        <div className="flex flex-col w-[100dvw] h-[100dvh] items-center justify-center gap-5">
            <h1 className="text-white">This is a protected page you are viewing</h1>
            <SignOutButton />
        </div>
    );
}

function SignOutButton() {
    const navigate = useNavigate();
    const handleClick = async () => {
        await signOut();
        navigate("/authenticate");
    };
    return (
        <button
            onClick={handleClick}
            className="bg-golden-bell-700 text-white px-5 py-2 rounded-md min-w-32 hover:bg-golden-bell-600"
        >
            Sign Out
        </button>
    );
}

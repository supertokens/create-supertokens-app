import { useNavigate } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/emailpassword";

export default function DashboardPage() {
    return (
        <div>
            <h1>This is a protected page you are viewing</h1>
            <SignOutButton />
        </div>
    );
}

function SignOutButton() {
    const navigate = useNavigate();
    const handleClick = async () => {
        await signOut();
        navigate("/signin");
    };
    return <button onClick={handleClick}>Sign Out</button>;
}

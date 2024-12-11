import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { signOut } from "supertokens-auth-react/recipe/session";
import { recipeDetails } from "../config";
import SessionInfo from "./SessionInfo";
import { BlogsIcon, CelebrateIcon, GuideIcon, SignOutIcon } from "../assets/images";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

export interface Link {
    name: string;
    onClick: () => void;
    icon: string;
}

export default function Dashboard() {
    const sessionContext = useSessionContext();
    const navigate = useNavigate();

    if (sessionContext.loading === true) {
        return null;
    }

    async function logoutClicked() {
        await signOut();
        navigate("/auth");
    }

    function openLink(url: string) {
        window.open(url, "_blank");
    }

    const links: Link[] = [
        {
            name: "Blogs",
            onClick: () => openLink("https://supertokens.com/blog"),
            icon: BlogsIcon,
        },
        {
            name: "Documentation",
            onClick: () => openLink(recipeDetails.docsLink),
            icon: GuideIcon,
        },
        {
            name: "Sign Out",
            onClick: logoutClicked,
            icon: SignOutIcon,
        },
    ];

    return (
        <div className="fill" id="home-container">
            <div className="main-container">
                <div className="top-band success-title bold-500">
                    <img src={CelebrateIcon} alt="Login successful" className="success-icon" /> Login successful
                </div>
                <div className="inner-content">
                    <div>Your userID is:</div>
                    <div className="truncate" id="user-id">
                        {sessionContext.userId}
                    </div>
                    <SessionInfo />
                </div>
            </div>
            <Footer links={links} />
        </div>
    );
}

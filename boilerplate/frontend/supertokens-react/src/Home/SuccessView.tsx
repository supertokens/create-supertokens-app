import { useNavigate } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/session";
import CallAPIView from "./CallAPIView";
import { ArrowRight, BlogsIcon, CelebrateIcon, GitHubIcon, GuideIcon, SeparatorLine, SignOutIcon } from "./img";

export default function SuccessView(props: { userId: string }) {
    let userId = props.userId;

    const navigate = useNavigate();

    async function logoutClicked() {
        await signOut();
        navigate("/auth");
    }

    const links: { name: string; onClick: () => void; icon: string }[] = [
        {
            name: "GitHub",
            onClick: logoutClicked,
            icon: GitHubIcon,
        },
        {
            name: "Blogs",
            onClick: logoutClicked,
            icon: BlogsIcon,
        },
        {
            name: "Guides",
            onClick: logoutClicked,
            icon: GuideIcon,
        },
        {
            name: "Sign Out",
            onClick: logoutClicked,
            icon: SignOutIcon,
        },
    ];

    return (
        <>
            <div className="main-container">
                <div className="top-band success-title bold-500">
                    <img src={CelebrateIcon} alt="Login successful" className="success-icon" /> Login successful
                </div>
                <div className="inner-content">
                    <div>Your userID is:</div>
                    <div id="user-id">
                        aihdf2390-hfqefuabfjab-fjabdfljadsdssd...
                        {userId}
                    </div>
                    <CallAPIView />
                </div>
                <div className="bottom-band bottom-cta-container">
                    <div className="view-code" role={"button"}>
                        View Code <img src={ArrowRight} alt="arrow right" id="arrow right" />
                    </div>
                </div>
            </div>
            <div className="bottom-links-container">
                {links.map((link) => (
                    <div className="link">
                        <img className="link-icon" src={link.icon} alt={link.name} />
                        <div role={"button"} onClick={link.onClick}>
                            {link.name}
                        </div>
                    </div>
                ))}
            </div>
            <img src={SeparatorLine} alt="separator" />
        </>
    );
}

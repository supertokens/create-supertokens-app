import { useSessionContext, signOut } from "supertokens-auth-react/recipe/session";
import { useNavigate } from "react-router-dom";
import { getApiDomain } from "../config";

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

    async function callAPIClicked() {
        try {
            const response = await fetch(getApiDomain() + "/sessioninfo");
            const data = await response.json();
            window.alert("Session Information:\n" + JSON.stringify(data, null, 2));
        } catch (err) {
            window.alert("Error calling API: " + err.message);
        }
    }

    return (
        <div className="fill" id="home-container">
            <div className="main-container">
                <div className="top-band success-title bold-500">
                    <img src="/celebrate-icon.svg" alt="Login successful" className="success-icon" />
                    Login successful
                </div>
                <div className="inner-content">
                    <div>Your userID is:</div>
                    <div className="truncate" id="user-id">
                        {sessionContext.userId}
                    </div>
                    <button onClick={callAPIClicked} className="sessionButton">
                        Call API
                    </button>
                </div>
            </div>
            <nav className="bottom-links-container">
                <a href="https://supertokens.com/blog" target="_blank" rel="noopener noreferrer" className="link">
                    <img src="/blogs-icon.svg" alt="Blogs" className="link-icon" />
                    <span>Blogs</span>
                </a>
                <a
                    href="https://supertokens.com/docs/guides"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                >
                    <img src="/guide-icon.svg" alt="Documentation" className="link-icon" />
                    <span>Documentation</span>
                </a>
                <button onClick={logoutClicked} className="link">
                    <img src="/signout-icon.svg" alt="Sign Out" className="link-icon" />
                    <span>Sign Out</span>
                </button>
            </nav>
            <img className="separator-line" src="/separator-line.svg" alt="separator" />
        </div>
    );
}

import { Link, useNavigate } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/session";
import { getApiDomain } from "../config";

export default function Home() {
    const navigate = useNavigate();

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
            <section className="logos">
                <img src="/ST.svg" alt="SuperTokens" />
                <span>x</span>
                <img src="/React.svg" alt="React" />
            </section>
            <section className="main-container">
                <div className="inner-content">
                    <h1>
                        <strong>SuperTokens</strong> x <strong>React</strong> <br /> example project
                    </h1>
                    <nav className="buttons">
                        <Link to="/auth" className="sessionButton">
                            Sign-up / Login
                        </Link>
                        <Link to="/dashboard" className="sessionButton">
                            Dashboard
                        </Link>
                        <button onClick={callAPIClicked} className="sessionButton">
                            Call API
                        </button>
                    </nav>
                </div>
            </section>
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

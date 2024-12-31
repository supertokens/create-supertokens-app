import { Link } from "@remix-run/react";

export default function Home() {
    return (
        <div className="fill" id="home-container">
            <div className="logos">
                <img src="/ST.svg" alt="SuperTokens" />
                <span>x</span>
                <img src="/remix.png" alt="Remix" />
            </div>
            <div className="main-container">
                <div className="inner-content">
                    <p>
                        <strong>SuperTokens</strong> x <strong>Remix</strong> <br /> example project
                    </p>
                    <div className="buttons">
                        <Link to="/auth" className="sessionButton">
                            Sign-up / Login
                        </Link>
                        <Link to="/dashboard" className="sessionButton">
                            Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

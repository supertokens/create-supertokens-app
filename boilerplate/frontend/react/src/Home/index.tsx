import { Link } from "react-router-dom";

export default function Home() {
    return (
        <main className="fill" id="home-container">
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
                    </nav>
                </div>
            </section>
        </main>
    );
}

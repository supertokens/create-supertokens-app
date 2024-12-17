import { getApiDomain } from "../config/frontend";

export default function Home() {
    return (
        <>
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
                        <a href="/auth" className="dashboard-button">
                            Sign-up / Login
                        </a>
                        <a href="/dashboard" className="dashboard-button">
                            Dashboard
                        </a>
                    </nav>
                </div>
            </section>
        </>
    );
}

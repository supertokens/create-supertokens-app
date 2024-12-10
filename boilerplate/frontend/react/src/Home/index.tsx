export default function Home() {
    return (
        <div className="fill" id="home-container">
            <div className="logos">
                <img src="/ST.svg" alt="SuperTokens" />
                <span>x</span>
                <img src="/React.svg" alt="React" />
            </div>
            <div className="main-container">
                <div className="inner-content">
                    <p>
                        <strong>SuperTokens</strong> x <strong>React</strong> <br /> example project
                    </p>
                    <div className="buttons">
                        <a href="/auth" className="sessionButton">
                            Sign-up / Login
                        </a>
                        <a href="/dashboard" className="sessionButton">
                            Dashboard
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

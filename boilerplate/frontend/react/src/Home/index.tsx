import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Session from "supertokens-auth-react/recipe/session";

export default function Home() {
    const [sessionExists, setSessionExists] = useState(false);
    useEffect(() => {
        Session.doesSessionExist().then((exists) => {
            setSessionExists(exists);
        });
    }, []);

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
                    <div>
                        {sessionExists ? (
                            <p>
                                You're signed in already, <br /> check out the Dashboard! 👇
                            </p>
                        ) : (
                            <p>Sign-in to continue</p>
                        )}
                    </div>
                    <nav className="buttons">
                        {sessionExists ? (
                            <Link to="/dashboard" className="dashboard-button">
                                Dashboard
                            </Link>
                        ) : (
                            <Link to="/auth" className="dashboard-button">
                                Sign-up / Login
                            </Link>
                        )}
                    </nav>
                </div>
            </section>
        </>
    );
}

"use client";

import Link from "next/link";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

export function HomePage() {
    const session = useSessionContext();

    if (session.loading) {
        return null;
    }

    return (
        <>
            <section className="logos">
                <img src="/ST.svg" alt="SuperTokens" />
                <span>x</span>
                <img src="/next.svg" alt="Next" />
            </section>
            <section className="main-container">
                <div className="inner-content">
                    <h1>
                        <strong>SuperTokens</strong> x <strong>Next.js</strong> <br /> example project
                    </h1>
                    <div>
                        {session.doesSessionExist ? (
                            <p>
                                You're signed in already, <br /> check out the Dashboard! 👇
                            </p>
                        ) : (
                            <p>Sign-in to continue</p>
                        )}
                    </div>
                    <nav className="buttons">
                        {session.doesSessionExist ? (
                            <Link href="/dashboard" className="dashboard-button">
                                Dashboard
                            </Link>
                        ) : (
                            <Link href="/auth" className="dashboard-button">
                                Sign-up / Login
                            </Link>
                        )}
                    </nav>
                </div>
            </section>
        </>
    );
}

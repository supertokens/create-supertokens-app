import Link from "next/link";
import dynamic from "next/dynamic";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

function Home() {
    const session = useSessionContext();

    if (session.loading !== false) {
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
                                You&apos;re signed in already, <br /> check out the Dashboard! 👇
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

export default dynamic(() => Promise.resolve(Home), { ssr: false });

import Link from "next/link";

export function HomePage() {
    return (
        <div className="fill" id="home-container">
            <div className="logos">
                <img src="/ST.svg" alt="SuperTokens" />
                <span>x</span>
                <img src="/next.svg" alt="Next.js" />
            </div>
            <div className="main-container">
                <div className="inner-content">
                    <p>
                        <strong>SuperTokens</strong> x <strong>Nextjs</strong> <br /> example project
                    </p>
                    <div className="buttons">
                        <Link href="/auth" className="sessionButton">
                            Sign-up / Login
                        </Link>
                        <Link href="/dashboard" className="sessionButton">
                            Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

import Link from "next/link";
import Image from "next/image";

export default function Home() {
    return (
        <div className="fill" id="home-container">
            <div className="logos">
                <Image src="/ST.svg" alt="SuperTokens" width={200} height={200} />
                <span>x</span>
                <Image src="/next.svg" alt="Next.js" width={240} height={240} />
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

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SuperTokensProvider } from "./components/supertokensProvider";
import { SeparatorLine } from "../assets/images";
import Link from "next/link";
import Image from "next/image";
import { ComponentWrapper } from "./config/frontend";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "SuperTokens + Nextjs",
    description: "SuperTokens demo app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    "use client";
    return (
        <html lang="en">
            <body className={`${inter.className} app-wrapper`}>
                <SuperTokensProvider>
                    <div className="App app-container">
                        <header>
                            <nav className="header-container">
                                <Link href="/">
                                    <img src="/ST.svg" alt="SuperTokens" />
                                </Link>
                                <ul className="header-container-right">
                                    <li>
                                        <a
                                            href="https://supertokens.com/docs//"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Docs
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://github.com/supertokens/create-supertokens-app"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            CLI Repo
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </header>
                        <div className="fill" id="home-container">
                            <ComponentWrapper>
                                <>
                                    {children}
                                    <footer>
                                        Built with ❤️ by the folks at{" "}
                                        <a href="https://supertokens.io" target="_blank" rel="noopener noreferrer">
                                            supertokens.com
                                        </a>
                                        .
                                    </footer>
                                    <Image className="separator-line" src={SeparatorLine} alt="separator" />
                                </>
                            </ComponentWrapper>
                        </div>
                    </div>
                </SuperTokensProvider>
            </body>
        </html>
    );
}

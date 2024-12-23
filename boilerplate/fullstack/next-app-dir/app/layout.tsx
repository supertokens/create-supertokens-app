import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SuperTokensProvider } from "./components/supertokensProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "SuperTokens + Nextjs",
    description: "SuperTokens demo app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${inter.className} app-wrapper`}>
                <SuperTokensProvider>
                    <header>
                        <div className="header-container">
                            <a href="/">
                                <img src="/ST.svg" alt="SuperTokens" />
                            </a>
                        </div>
                        <div className="header-container-right">
                            <a href="https://supertokens.com/docs/guides/getting-started/react" target="_blank">
                                Docs
                            </a>
                            <a href="https://github.com/supertokens/create-supertokens-app" target="_blank">
                                CLI Repo
                            </a>
                        </div>
                    </header>
                    <div className="App app-container">
                        <div className="fill">{children}</div>
                    </div>
                </SuperTokensProvider>
            </body>
        </html>
    );
}

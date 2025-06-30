"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
require("./globals.css");
const google_1 = require("next/font/google");
const supertokensProvider_1 = require("./components/supertokensProvider");
const images_1 = require("../assets/images");
const link_1 = __importDefault(require("next/link"));
const image_1 = __importDefault(require("next/image"));
const inter = (0, google_1.Inter)({ subsets: ["latin"] });
exports.metadata = {
    title: "SuperTokens + Nextjs",
    description: "SuperTokens demo app",
};
function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${inter.className} app-wrapper`}>
                <supertokensProvider_1.SuperTokensProvider>
                    <div className="App app-container">
                        <header>
                            <nav className="header-container">
                                <link_1.default href="/">
                                    <img src="/ST.svg" alt="SuperTokens" />
                                </link_1.default>
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
                            {children}
                            <footer>
                                Built with ❤️ by the folks at{" "}
                                <a href="https://supertokens.io" target="_blank" rel="noopener noreferrer">
                                    supertokens.com
                                </a>
                                .
                            </footer>
                            <image_1.default className="separator-line" src={images_1.SeparatorLine} alt="separator" />
                        </div>
                    </div>
                </supertokensProvider_1.SuperTokensProvider>
            </body>
        </html>
    );
}
exports.default = RootLayout;

"use client";
"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomePage = void 0;
const link_1 = __importDefault(require("next/link"));
const session_1 = require("supertokens-auth-react/recipe/session");
function HomePage() {
    const session = (0, session_1.useSessionContext)();
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
                            <link_1.default href="/dashboard" className="dashboard-button">
                                Dashboard
                            </link_1.default>
                        ) : (
                            <link_1.default href="/auth" className="dashboard-button">
                                Sign-up / Login
                            </link_1.default>
                        )}
                    </nav>
                </div>
            </section>
        </>
    );
}
exports.HomePage = HomePage;

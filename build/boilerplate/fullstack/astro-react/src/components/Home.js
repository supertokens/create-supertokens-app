"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const session_1 = __importDefault(require("supertokens-auth-react/recipe/session"));
function Home() {
    const [sessionExists, setSessionExists] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        session_1.default.doesSessionExist().then((exists) => {
            setSessionExists(exists);
        });
    }, []);
    return (
        <>
            <section className="logos">
                <img src="/ST.svg" alt="SuperTokens" />
                <span>x</span>
                <img src="/astro-icon-dark.svg" alt="Astro" />
            </section>
            <section className="main-container">
                <div className="inner-content">
                    <h1>
                        <strong>SuperTokens</strong> x <strong>Astro (React)</strong> <br /> example project
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
                            <a href="/dashboard" className="dashboard-button">
                                Dashboard
                            </a>
                        ) : (
                            <a href="/auth" className="dashboard-button">
                                Sign-up / Login
                            </a>
                        )}
                    </nav>
                </div>
            </section>
        </>
    );
}
exports.default = Home;

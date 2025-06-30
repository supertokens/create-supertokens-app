"use strict";
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              var desc = Object.getOwnPropertyDescriptor(m, k);
              if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
                  desc = {
                      enumerable: true,
                      get: function () {
                          return m[k];
                      },
                  };
              }
              Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              o[k2] = m[k];
          });
var __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
        ? function (o, v) {
              Object.defineProperty(o, "default", { enumerable: true, value: v });
          }
        : function (o, v) {
              o["default"] = v;
          });
var __importStar =
    (this && this.__importStar) ||
    function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
require("../styles/globals.css");
const react_1 = require("react");
const supertokens_auth_react_1 = __importStar(require("supertokens-auth-react"));
const frontendConfig_1 = require("../config/frontendConfig");
const session_1 = __importDefault(require("supertokens-auth-react/recipe/session"));
const link_1 = __importDefault(require("next/link"));
const image_1 = __importDefault(require("next/image"));
const images_1 = require("../assets/images");
if (typeof window !== "undefined") {
    supertokens_auth_react_1.default.init(frontendConfig_1.SuperTokensConfig);
}
function MyApp({ Component, pageProps }) {
    (0, react_1.useEffect)(() => {
        async function doRefresh() {
            if (pageProps.fromSupertokens === "needs-refresh") {
                if (await session_1.default.attemptRefreshingSession()) {
                    location.reload();
                } else {
                    // user has been logged out
                    supertokens_auth_react_1.default.redirectToAuth();
                }
            }
        }
        doRefresh();
    }, [pageProps.fromSupertokens]);
    if (pageProps.fromSupertokens === "needs-refresh") {
        return null;
    }
    return (
        <div className="App app-container">
            <supertokens_auth_react_1.SuperTokensWrapper>
                <header>
                    <nav className="header-container">
                        <link_1.default href="/">
                            <img src="/ST.svg" alt="SuperTokens" />
                        </link_1.default>
                        <ul className="header-container-right">
                            <li>
                                <a href="https://supertokens.com/docs//" target="_blank" rel="noopener noreferrer">
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
                    <Component {...pageProps} />
                    <footer>
                        Built with ❤️ by the folks at{" "}
                        <a href="https://supertokens.io" target="_blank" rel="noopener noreferrer">
                            supertokens.com
                        </a>
                        .
                    </footer>
                    <image_1.default className="separator-line" src={images_1.SeparatorLine} alt="separator" />
                </div>
            </supertokens_auth_react_1.SuperTokensWrapper>
        </div>
    );
}
exports.default = MyApp;

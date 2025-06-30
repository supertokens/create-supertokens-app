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
Object.defineProperty(exports, "__esModule", { value: true });
const supertokens_auth_react_1 = __importStar(require("supertokens-auth-react"));
const frontendConfigUtils_1 = require("../config/frontendConfigUtils");
const index_js_1 = require("supertokens-auth-react/recipe/session/index.js");
supertokens_auth_react_1.default.init((0, frontendConfigUtils_1.frontendConfig)());
function App({ children }) {
    const isUnprotectedRoute = location.pathname.startsWith("/auth") || location.pathname === "/";
    return (
        <supertokens_auth_react_1.SuperTokensWrapper>
            {isUnprotectedRoute ? children : <index_js_1.SessionAuth>{children}</index_js_1.SessionAuth>}
        </supertokens_auth_react_1.SuperTokensWrapper>
    );
}
exports.default = App;

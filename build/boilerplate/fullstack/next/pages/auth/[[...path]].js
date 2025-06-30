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
const react_1 = __importStar(require("react"));
const dynamic_1 = __importDefault(require("next/dynamic"));
const supertokens_auth_react_1 = __importDefault(require("supertokens-auth-react"));
const ui_1 = require("supertokens-auth-react/ui");
const frontendConfig_1 = require("../../config/frontendConfig");
const SuperTokensComponentNoSSR = (0, dynamic_1.default)(
    new Promise((res) => res(() => (0, ui_1.getRoutingComponent)(frontendConfig_1.PreBuiltUIList))),
    {
        ssr: false,
    }
);
function Auth() {
    (0, react_1.useEffect)(() => {
        if ((0, ui_1.canHandleRoute)(frontendConfig_1.PreBuiltUIList) === false) {
            supertokens_auth_react_1.default.redirectToAuth({
                redirectBack: false,
            });
        }
    }, []);
    return <SuperTokensComponentNoSSR />;
}
exports.default = Auth;

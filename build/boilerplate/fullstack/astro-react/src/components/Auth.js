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
const react_1 = require("react");
const index_js_1 = __importStar(require("supertokens-auth-react/ui/index.js"));
const frontendConfigUtils_1 = require("../config/frontendConfigUtils");
const index_js_2 = __importDefault(require("supertokens-auth-react/index.js"));
function Auth() {
    // If the user visits a page that is not handled by us (like /auth/random), then we redirect them back to the auth page.
    const [loaded, setLoaded] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if ((0, index_js_1.canHandleRoute)(frontendConfigUtils_1.PreBuiltUIList) === false) {
            index_js_2.default.redirectToAuth({ redirectBack: false });
        } else {
            setLoaded(true);
        }
    }, []);
    if (loaded) {
        return index_js_1.default.getRoutingComponent(frontendConfigUtils_1.PreBuiltUIList);
    }
    return null;
}
exports.default = Auth;

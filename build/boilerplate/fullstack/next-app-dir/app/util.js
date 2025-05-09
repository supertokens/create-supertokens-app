"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionForSSR = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const backendConfigUtils_1 = require("./config/backendConfigUtils");
const appInfo = (0, backendConfigUtils_1.backendConfig)().appInfo;
const client = (0, jwks_rsa_1.default)({
    jwksUri: `${appInfo.apiDomain}${appInfo.apiBasePath}jwt/jwks.json`,
});
async function verifyToken(token) {
    const getPublicKey = (header, callback) => {
        client.getSigningKey(header.kid, (err, key) => {
            if (err) {
                callback(err);
            } else {
                const signingKey = key?.getPublicKey();
                callback(null, signingKey);
            }
        });
    };
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, getPublicKey, {}, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}
/**
 * A helper function to retrieve session details on the server side.
 *
 * NOTE: This function does not use the getSession function from the supertokens-node SDK
 * because getSession can update the access token. These updated tokens would not be
 * propagated to the client side, as request interceptors do not run on the server side.
 */
async function getSessionForSSR(cookies) {
    let accessToken = cookies.find((cookie) => cookie.name === "sAccessToken")?.value;
    const hasToken = !!accessToken;
    try {
        if (accessToken) {
            const decoded = await verifyToken(accessToken);
            return { accessTokenPayload: decoded, hasToken, error: undefined };
        }
        return { accessTokenPayload: undefined, hasToken, error: undefined };
    } catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return { accessTokenPayload: undefined, hasToken, error: undefined };
        }
        return { accessTokenPayload: undefined, hasToken, error: error };
    }
}
exports.getSessionForSSR = getSessionForSSR;

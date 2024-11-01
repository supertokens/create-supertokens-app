import JsonWebToken from "jsonwebtoken";
import type { JwtHeader, JwtPayload, SigningKeyCallback } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { appInfo } from "./config/appInfo";

const client = jwksClient({
    jwksUri: `${appInfo.apiDomain}${appInfo.apiBasePath}/jwt/jwks.json`,
});

async function verifyToken(token: string): Promise<JwtPayload> {
    const getPublicKey = (header: JwtHeader, callback: SigningKeyCallback) => {
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
        JsonWebToken.verify(token, getPublicKey, {}, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded as JwtPayload);
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
export async function getSessionForSSR(cookies: Array<{ name: string; value: string }>): Promise<{
    accessTokenPayload: JwtPayload | undefined;
    hasToken: boolean;
    error: Error | undefined;
}> {
    let accessToken = cookies.find((cookie) => cookie.name === "sAccessToken")?.value;
    const hasToken = !!accessToken;
    try {
        if (accessToken) {
            const decoded = await verifyToken(accessToken);
            return { accessTokenPayload: decoded, hasToken, error: undefined };
        }
        return { accessTokenPayload: undefined, hasToken, error: undefined };
    } catch (error) {
        if (error instanceof JsonWebToken.TokenExpiredError) {
            return { accessTokenPayload: undefined, hasToken, error: undefined };
        }
        return { accessTokenPayload: undefined, hasToken, error: error as Error };
    }
}

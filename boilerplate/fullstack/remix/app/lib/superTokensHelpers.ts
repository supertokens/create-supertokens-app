import {
    PreParsedRequest,
    CollectingResponse,
    middleware,
    errorHandler,
} from "supertokens-node/framework/custom/index.js";
import Session, { SessionContainer, VerifySessionOptions } from "supertokens-node/recipe/session/index.js";
import SessionRecipe from "supertokens-node/lib/build/recipe/session/recipe.js";
import { availableTokenTransferMethods } from "supertokens-node/lib/build/recipe/session/constants.js";
import { getToken } from "supertokens-node/lib/build/recipe/session/cookieAndHeaders.js";
import { parseJWTWithoutSignatureVerification } from "supertokens-node/lib/build/recipe/session/jwt.js";
import { UserContext } from "supertokens-node/types";
import { getUserContext } from "supertokens-node/lib/build/utils.js";
import { serialize } from "cookie";

type HTTPMethod = "post" | "get" | "delete" | "put" | "options" | "trace";

export function handleAuthAPIRequest<Request>(RemixResponse: typeof Response) {
    const stMiddleware = middleware<Request>((req) => {
        return createPreParsedRequest(req);
    });

    return async function handleCall(req: Request) {
        const baseResponse = new CollectingResponse();

        const { handled, error } = await stMiddleware(req, baseResponse);

        if (error) {
            throw error;
        }
        if (!handled) {
            return new RemixResponse("Not found", { status: 404 });
        }

        for (const respCookie of baseResponse.cookies) {
            baseResponse.headers.append(
                "Set-Cookie",
                serialize(respCookie.key, respCookie.value, {
                    domain: respCookie.domain,
                    expires: new Date(respCookie.expires),
                    httpOnly: respCookie.httpOnly,
                    path: respCookie.path,
                    sameSite: respCookie.sameSite,
                    secure: respCookie.secure,
                })
            );
        }

        return new RemixResponse(baseResponse.body, {
            headers: baseResponse.headers,
            status: baseResponse.statusCode,
        });
    };
}

export function getCookieFromRequest(request: Request) {
    const cookies: Record<string, string> = {};
    const cookieHeader = request.headers.get("Cookie");
    if (cookieHeader) {
        const cookieStrings = cookieHeader.split(";");
        for (const cookieString of cookieStrings) {
            const [name, value] = cookieString.trim().split("=");
            cookies[name] = decodeURIComponent(value);
        }
    }
    return cookies;
}

export function getQueryFromRequest(request: Request) {
    const query: Record<string, string> = {};
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    searchParams.forEach((value, key) => {
        query[key] = value;
    });
    return query;
}

export function createPreParsedRequest(request: Request): PreParsedRequest {
    return new PreParsedRequest({
        cookies: getCookieFromRequest(request),
        url: request.url as string,
        method: request.method as HTTPMethod,
        query: getQueryFromRequest(request),
        headers: request.headers,
        getFormBody: async () => {
            return await request.formData();
        },
        getJSONBody: async () => {
            return await request.json();
        },
    });
}

export async function getSessionDetails(
    baseRequest: PreParsedRequest | Request,
    options?: VerifySessionOptions,
    userContext?: Record<string, unknown> | UserContext
): Promise<{
    session: SessionContainer | undefined;
    hasToken: boolean;
    hasInvalidClaims: boolean;
    baseResponse?: CollectingResponse;
    RemixResponse?: Response;
}> {
    const request = baseRequest instanceof Request ? createPreParsedRequest(baseRequest) : baseRequest;
    const baseResponse = new CollectingResponse();
    // Possible interop issue.
    const recipe = (SessionRecipe as any).default.instance;
    const tokenTransferMethod = recipe.config.getTokenTransferMethod({
        req: request,
        forCreateNewSession: false,
        userContext,
    });
    const transferMethods = tokenTransferMethod === "any" ? availableTokenTransferMethods : [tokenTransferMethod];
    const hasToken = transferMethods.some((transferMethod) => {
        const token = getToken(request, "access", transferMethod);
        if (!token) {
            return false;
        }
        try {
            parseJWTWithoutSignatureVerification(token);
            return true;
        } catch {
            return false;
        }
    });

    try {
        const session = await Session.getSession(request, baseResponse, options, userContext);
        return {
            session,
            hasInvalidClaims: false,
            hasToken,
            baseResponse,
        };
    } catch (err) {
        if (Session.Error.isErrorFromSuperTokens(err)) {
            return {
                hasToken,
                hasInvalidClaims: err.type === Session.Error.INVALID_CLAIMS,
                session: undefined,
                baseResponse,
                RemixResponse: new Response("Authentication required", {
                    status: err.type === Session.Error.INVALID_CLAIMS ? 403 : 401,
                }),
            };
        } else {
            throw err;
        }
    }
}

export async function withSession<Request, Response>(
    req: Request,
    handler: (error: Error | undefined, session: SessionContainer | undefined) => Promise<Response>,
    options?: VerifySessionOptions,
    userContext?: Record<string, any>
): Promise<Response> {
    try {
        const query = getQueryFromRequest(req);
        const cookies = getCookieFromRequest(req);

        const baseRequest = new PreParsedRequest({
            method: req.method as HTTPMethod,
            url: req.url,
            query: query,
            headers: req.headers,
            cookies: cookies,
            getFormBody: () => req!.formData(),
            getJSONBody: () => req!.json(),
        });

        const { session, RemixResponse, baseResponse } = await getSessionDetails(
            baseRequest,
            options,
            getUserContext(userContext)
        );

        if (RemixResponse) {
            return RemixResponse as Response;
        }

        let userResponse: Response;

        try {
            userResponse = await handler(undefined, session);
        } catch (err) {
            if (baseResponse) {
                await errorHandler()(err, baseRequest, baseResponse, (errorHandlerError: Error) => {
                    if (errorHandlerError) {
                        throw errorHandlerError;
                    }
                });
            }

            // The headers in the userResponse are set twice from baseResponse, but the resulting response contains unique headers.
            userResponse = new Response(baseResponse?.body, {
                status: baseResponse?.statusCode,
                headers: baseResponse?.headers,
            }) as Response;

            let didAddCookies = false;
            let didAddHeaders = false;

            if (baseResponse) {
                for (const respCookie of baseResponse.cookies) {
                    didAddCookies = true;
                    userResponse.headers.append(
                        "Set-Cookie",
                        serialize(respCookie.key, respCookie.value, {
                            domain: respCookie.domain,
                            expires: new Date(respCookie.expires),
                            httpOnly: respCookie.httpOnly,
                            path: respCookie.path,
                            sameSite: respCookie.sameSite,
                            secure: respCookie.secure,
                        })
                    );
                }
            }

            if (baseResponse) {
                baseResponse.headers.forEach((value: string, key: string) => {
                    didAddHeaders = true;
                    userResponse.headers.set(key, value);
                });
                if (didAddCookies || didAddHeaders) {
                    if (!userResponse.headers.has("Cache-Control")) {
                        // This is needed for production deployments with Vercel
                        userResponse.headers.set("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
                    }
                }
            }
        }

        return userResponse;
    } catch (error) {
        return await handler(error as Error, undefined);
    }
}

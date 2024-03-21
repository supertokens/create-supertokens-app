import { middleware, PreParsedRequest, CollectingResponse } from "supertokens-node/framework/custom/index.js";
import { serialize } from "cookie";

export default function handleAuthAPIRequest<PreParsedRequest>(RemixResponse: typeof Response) {
    const stMiddleware = middleware<PreParsedRequest>((req) => {
        return req;
    });

    return async function handleCall(req: PreParsedRequest) {
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

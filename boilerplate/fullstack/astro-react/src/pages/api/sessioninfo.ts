import type { APIRoute } from "astro";
import { getSessionForSSR } from "supertokens-node/custom";

export const GET: APIRoute = async ({ request }) => {
    const { accessTokenPayload, hasToken, error } = await getSessionForSSR(request);

    if (!hasToken || error) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    return new Response(
        JSON.stringify({
            sessionHandle: accessTokenPayload.sessionHandle,
            userId: accessTokenPayload.sub,
            accessTokenPayload,
        }),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
};

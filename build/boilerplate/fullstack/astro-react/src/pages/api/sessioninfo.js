"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const custom_1 = require("supertokens-node/custom");
const GET = async ({ request }) => {
    const { accessTokenPayload, hasToken, error } = await (0, custom_1.getSessionForSSR)(request);
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
exports.GET = GET;

import { withSession } from "supertokens-node/custom";
export default defineEventHandler(async (event) => {
    try {
        const request = await convertToRequest(event);
        return withSession(request, async (err, session) => {
            if (err) {
                throw createError({ statusCode: 500, statusMessage: err.message || "Internal server error" });
            }
            const responseData = {
                note: "Fetch any data from your application for authenticated user after using verifySession middleware",
                userId: session.getUserId(),
                sessionHandle: session.getHandle(),
                accessTokenPayload: session.getAccessTokenPayload(),
            };
            return new Response(JSON.stringify(responseData), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        });
    } catch (err) {
        event.node.res.statusCode = 500;
    }
});

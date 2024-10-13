import { handleAuthAPIRequest } from "../superTokensHelper";
import { ensureSuperTokensInit } from "../backend";

ensureSuperTokensInit();

const handleCall = handleAuthAPIRequest(Response);

export default defineEventHandler(async (event) => {
    try {
        const request = await convertToRequest(event);
        const response = await handleCall(request);
        return response;
    } catch (err) {
        event.node.res.statusCode = 500;
        event.node.res.end(JSON.stringify({ error: "Internal server error" }));
    }
});

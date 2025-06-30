import { handleAuthAPIRequest } from "supertokens-node/custom";
import { ensureSuperTokensInit } from "../backendConfigUtils";
ensureSuperTokensInit();
const handleCall = handleAuthAPIRequest();
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

import { ensureSuperTokensInit } from "../../../config/backendConfigUtils";
import { handleAuthAPIRequest } from "supertokens-node/custom";
// Removed supertokens import as manual CORS handling is removed
import type { APIRoute } from "astro";

const handleCall = handleAuthAPIRequest();

export const ALL: APIRoute = async ({ request }) => {
    ensureSuperTokensInit();

    try {
        // Return the response directly; CORS should be handled by ST Node SDK or Astro adapter
        return await handleCall(request);
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
        });
    }
};

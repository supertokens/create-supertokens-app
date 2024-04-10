import { ensureSuperTokensInit } from "../../config/backend.js";
import { handleAuthAPIRequest } from "../../superTokensHelpers.js";
import type { APIRoute } from "astro";

const handleCall = handleAuthAPIRequest(Response);

export const ALL: APIRoute = async ({ request }) => {
    ensureSuperTokensInit();

    try {
        return await handleCall(request);
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
        });
    }
};

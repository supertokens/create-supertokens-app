import { ensureSuperTokensInit } from "../../../config/backend";
import { handleAuthAPIRequest } from "supertokens-node/custom";
import type { APIRoute } from "astro";

const handleCall = handleAuthAPIRequest();

export const ALL: APIRoute = async ({ request }) => {
    console.log("api auth");
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

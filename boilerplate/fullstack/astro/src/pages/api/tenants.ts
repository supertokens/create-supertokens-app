import { ensureSuperTokensInit } from "../../config/backendConfigUtils";
import Multitenancy from "supertokens-node/recipe/multitenancy";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
    ensureSuperTokensInit();

    try {
        return new Response(JSON.stringify(await Multitenancy.listAllTenants()));
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
        });
    }
};

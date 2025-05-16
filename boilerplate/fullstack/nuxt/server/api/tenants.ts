import { ensureSuperTokensInit } from "../backendConfigUtils";
import Multitenancy from "supertokens-node/recipe/multitenancy";

export default defineEventHandler(async (event) => {
    ensureSuperTokensInit();

    try {
        return new Response(JSON.stringify(await Multitenancy.listAllTenants()));
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
        });
    }
});

import { json } from "@sveltejs/kit";
import { handleAuthAPIRequest } from "supertokens-node/custom";
import { ensureSuperTokensInit } from "../../../config/backendConfigUtils";
import type { RequestHandler } from "./$types";

ensureSuperTokensInit();

const handleCall = handleAuthAPIRequest();

export const fallback: RequestHandler = async ({ request }) => {
    try {
        return await handleCall(request);
    } catch {
        return json({ error: "Internal server error" }, { status: 500 });
    }
};

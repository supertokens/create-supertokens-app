import { json } from "@sveltejs/kit";
import { handleAuthAPIRequest } from "supertokens-node/custom";
import { ensureSuperTokensInit } from "../../../config/backendConfigUtils";

ensureSuperTokensInit();

const handleCall = handleAuthAPIRequest();

export async function fallback({ request }) {
    try {
        return await handleCall(request);
    } catch (err) {
        return json({ error: "Internal server error" }, { status: 500 });
    }
}

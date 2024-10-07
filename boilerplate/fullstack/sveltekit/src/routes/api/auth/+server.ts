import { json } from "@sveltejs/kit";
import { handleAuthAPIRequest } from "supertokens-node/customframework";
import { ensureSuperTokensInit } from "../../../config/backend";

ensureSuperTokensInit();

const handleCall = handleAuthAPIRequest();

export async function fallback({ request }) {
    try {
        return await handleCall(request);
    } catch (err) {
        return json({ error: "Internal server error" }, { status: 500 });
    }
}

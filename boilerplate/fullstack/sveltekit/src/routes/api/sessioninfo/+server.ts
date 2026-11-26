import { json } from "@sveltejs/kit";
import { withSession } from "supertokens-node/custom";
import { ensureSuperTokensInit } from "../../../config/backendConfigUtils";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request }) => {
    ensureSuperTokensInit();
    return withSession(request, async (err, session) => {
        if (err) {
            return json(err, { status: 500 });
        }

        return json({
            note: "Fetch any data from your application for authenticated user after using verifySession middleware",
            userId: session!.getUserId(),
            sessionHandle: session!.getHandle(),
            accessTokenPayload: session!.getAccessTokenPayload(),
        });
    });
};

import { json } from "@sveltejs/kit";
import { withSession } from "supertokens-node/custom";

export async function GET({ request }) {
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
}

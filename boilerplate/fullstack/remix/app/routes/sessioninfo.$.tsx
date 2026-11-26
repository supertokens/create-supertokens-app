import type { LoaderFunctionArgs } from "react-router";
import { withSession } from "supertokens-node/custom";
import { ensureSuperTokensInit } from "../config/backendConfigUtils";

// Loader function for handling GET requests that also adds cache control headers
export async function loader({ request }: LoaderFunctionArgs) {
    ensureSuperTokensInit();
    return withSession(request, async (err, session) => {
        if (err) {
            return Response.json(err, { status: 500 });
        }

        return Response.json({
            note: "Fetch any data from your application for authenticated user after using verifySession middleware",
            userId: session!.getUserId(),
            sessionHandle: session!.getHandle(),
            accessTokenPayload: session!.getAccessTokenPayload(),
        });
    });
}

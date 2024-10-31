import { json, LoaderFunctionArgs } from "@remix-run/node";
import { withSession } from "supertokens-node/custom";

// Loader function for handling GET requests that also adds cache control headers
export async function loader({ request }: LoaderFunctionArgs) {
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

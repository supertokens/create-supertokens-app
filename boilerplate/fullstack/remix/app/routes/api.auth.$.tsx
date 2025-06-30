import { json, ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { handleAuthAPIRequest } from "supertokens-node/custom";

const handleCall = handleAuthAPIRequest();

// Action function for handling POST requests
export async function action({ request }: ActionFunctionArgs) {
    try {
        return await handleCall(request);
    } catch (error) {
        return json({ error: "Internal server error" }, { status: 500 });
    }
}
// Loader function for handling GET requests that also adds cache control headers
export async function loader({ request }: LoaderFunctionArgs) {
    try {
        const res = await handleCall(request);
        if (!res.headers.has("Cache-Control")) {
            res.headers.set("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
        }
        return res;
    } catch (error) {
        return json({ error: "Internal server error" }, { status: 500 });
    }
}

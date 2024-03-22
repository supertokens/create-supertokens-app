import { json } from "@remix-run/node";
import { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { createPreParsedRequest, handleAuthAPIRequest } from "../lib/superTokensHelpers.js";

async function handleCall(request: Request) {
    const preParsedRequest = createPreParsedRequest(request);
    return await handleAuthAPIRequest(Response)(preParsedRequest);
}

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

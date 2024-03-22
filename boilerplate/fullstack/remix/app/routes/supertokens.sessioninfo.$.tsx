import { json } from "@remix-run/node";
import { LoaderFunctionArgs } from "react-router-dom";
import { getSessionDetails } from "../lib/superTokensHelpers.js";

// Loader function for handling GET requests that also adds cache control headers
export async function loader({ request }: LoaderFunctionArgs) {
    try {
        const res = await getSessionDetails(request);
        return {
            session: res.session,
        };
    } catch (error) {
        return json({ error: "Internal server error" }, { status: 500 });
    }
}

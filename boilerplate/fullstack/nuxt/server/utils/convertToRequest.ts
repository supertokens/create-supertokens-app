import { H3Event, getRequestURL, getRequestHeaders, readRawBody, parseCookies } from "h3";
import { backendConfig } from "../backendConfigUtils";

const appInfo = backendConfig().appInfo;

/**
 * Converts an H3Event to a standard Request object compatible with SuperTokens
 * This properly handles cookies and headers required for session management
 */
export default async function convertToRequest(event: H3Event): Promise<Request> {
    try {
        // Get the full URL including query parameters
        const requestURL = getRequestURL(event);
        const url = new URL(`${appInfo.apiDomain}${requestURL.pathname}${requestURL.search}`);

        // Create headers from the request
        const requestHeaders = getRequestHeaders(event);
        const headers = new Headers();

        // Properly copy all headers
        Object.entries(requestHeaders).forEach(([key, value]) => {
            if (value !== undefined) {
                headers.append(key, Array.isArray(value) ? value.join(", ") : String(value));
            }
        });

        // Make sure the cookie header is set correctly for session management
        // Using parseCookies from h3 to get all cookies from the request
        const cookies = parseCookies(event);
        if (Object.keys(cookies).length > 0) {
            const cookieString = Object.entries(cookies)
                .map(([name, value]) => `${name}=${value}`)
                .join('; ');

            // Set the Cookie header explicitly to ensure it's passed to SuperTokens
            headers.set('Cookie', cookieString);
        }

        const method = (event.method || "GET").toUpperCase();

        // Initialize options for the Request
        const options: RequestInit = {
            method,
            headers,
            // Ensure cookies are passed through
            credentials: "include",
        };

        // Handle request body for non-GET/HEAD requests
        if (method !== "GET" && method !== "HEAD") {
            try {
                // Use readRawBody instead of readBody to get the raw buffer
                const rawBody = await readRawBody(event);
                if (rawBody) {
                    // Create a simpler Blob-based body instead of using ReadableStream
                    options.body = new Blob([rawBody]);
                }
            } catch (error) {
                console.error("Error reading request body:", error);
                // Continue without body if there's an error reading it
            }
        }

        return new Request(url.toString(), options);
    } catch (error) {
        console.error("Error creating Request object:", error);
        throw new Error(`Failed to convert H3Event to Request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

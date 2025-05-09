import { backendConfig } from "../backendConfigUtils";
const appInfo = backendConfig().appInfo;
export default async function convertToRequest(event) {
    const url = new URL(`${appInfo.apiDomain}${event._path}`);
    const headers = new Headers(event.node.req.headers);
    const method = (event.method || "GET").toUpperCase();
    let body = null;
    if (method !== "GET" && method !== "HEAD") {
        // Read the body only once and convert it into a format that can be used in the request.
        const rawBody = await readBody(event);
        if (typeof rawBody === "object") {
            body = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode(JSON.stringify(rawBody)));
                    controller.close();
                },
            });
        } else if (typeof rawBody === "string") {
            body = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode(rawBody));
                    controller.close();
                },
            });
        }
    }
    const request = {
        method,
        headers,
        body,
        duplex: "half",
    };
    return new Request(url, request);
}

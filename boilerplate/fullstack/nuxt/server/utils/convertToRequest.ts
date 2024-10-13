import { H3Event } from "h3";
import { appInfo } from "~/config/appInfo";

interface ExtendedRequestInit extends RequestInit {
    duplex?: string;
}

export async function convertToRequest(event: H3Event): Promise<Request> {
    const url = new URL(`${appInfo.apiDomain}${event._path}`);
    const headers = new Headers(event.node.req.headers as Record<string, string>);
    const method = event.method || "GET";

    let body: ReadableStream | null = null;
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

    const request: ExtendedRequestInit = {
        method,
        headers,
        body,
        duplex: "half",
    };
    return new Request(url, request);
}

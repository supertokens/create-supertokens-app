"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.middleware = void 0;
const server_1 = require("next/server");
const nextjs_1 = require("supertokens-node/nextjs");
async function middleware(request) {
    if (request.headers.has("x-user-id")) {
        console.warn(
            "The FE tried to pass x-user-id, which is only supposed to be a backend internal header. Ignoring."
        );
        request.headers.delete("x-user-id");
    }
    if (request.nextUrl.pathname.startsWith("/api/auth")) {
        // this hits our pages/api/auth/* endpoints
        return server_1.NextResponse.next();
    }
    return (0, nextjs_1.withSession)(request, async (err, session) => {
        if (err) {
            return server_1.NextResponse.json(err, { status: 500 });
        }
        if (session === undefined) {
            return server_1.NextResponse.next();
        }
        return server_1.NextResponse.next({
            headers: {
                "x-user-id": session.getUserId(),
            },
        });
    });
}
exports.middleware = middleware;
exports.config = {
    matcher: "/api/:path*",
};

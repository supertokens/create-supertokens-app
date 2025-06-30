"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const backendConfigUtils_1 = require("@/app/config/backendConfigUtils");
const server_1 = require("next/server");
const nextjs_1 = require("supertokens-node/nextjs");
(0, backendConfigUtils_1.ensureSuperTokensInit)();
function GET(request) {
    return (0, nextjs_1.withSession)(request, async (err, session) => {
        if (err) {
            return server_1.NextResponse.json(err, { status: 500 });
        }
        if (!session) {
            return new server_1.NextResponse("Authentication required", { status: 401 });
        }
        return server_1.NextResponse.json({
            note: "Fetch any data from your application for authenticated user after using verifySession middleware",
            userId: session.getUserId(),
            sessionHandle: session.getHandle(),
            accessTokenPayload: session.getAccessTokenPayload(),
        });
    });
}
exports.GET = GET;

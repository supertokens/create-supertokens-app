"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HEAD = exports.PATCH = exports.PUT = exports.DELETE = exports.POST = exports.GET = void 0;
const nextjs_1 = require("supertokens-node/nextjs");
const backendConfigUtils_1 = require("../../../config/backendConfigUtils");
(0, backendConfigUtils_1.ensureSuperTokensInit)();
const handleCall = (0, nextjs_1.getAppDirRequestHandler)();
async function GET(request) {
    const res = await handleCall(request);
    if (!res.headers.has("Cache-Control")) {
        // This is needed for production deployments with Vercel
        res.headers.set("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
    }
    return res;
}
exports.GET = GET;
async function POST(request) {
    return handleCall(request);
}
exports.POST = POST;
async function DELETE(request) {
    return handleCall(request);
}
exports.DELETE = DELETE;
async function PUT(request) {
    return handleCall(request);
}
exports.PUT = PUT;
async function PATCH(request) {
    return handleCall(request);
}
exports.PATCH = PATCH;
async function HEAD(request) {
    return handleCall(request);
}
exports.HEAD = HEAD;

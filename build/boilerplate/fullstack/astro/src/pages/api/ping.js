"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const GET = async () => {
    return new Response(JSON.stringify({ message: "pong" }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
exports.GET = GET;

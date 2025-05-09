"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL = void 0;
const backendConfigUtils_1 = require("../../../../config/backendConfigUtils");
const custom_1 = require("supertokens-node/custom");
const handleCall = (0, custom_1.handleAuthAPIRequest)();
const ALL = async ({ request }) => {
    (0, backendConfigUtils_1.ensureSuperTokensInit)();
    try {
        return await handleCall(request);
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
        });
    }
};
exports.ALL = ALL;

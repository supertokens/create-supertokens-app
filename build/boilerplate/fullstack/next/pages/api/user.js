"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const nextjs_1 = require("supertokens-node/nextjs");
const express_1 = require("supertokens-node/recipe/session/framework/express");
const supertokens_node_1 = __importDefault(require("supertokens-node"));
const backendConfig_1 = require("../../config/backendConfig");
supertokens_node_1.default.init(backendConfig_1.SuperTokensConfig);
async function user(req, res) {
    await (0, nextjs_1.superTokensNextWrapper)(
        async (next) => {
            return await (0, express_1.verifySession)()(req, res, next);
        },
        req,
        res
    );
    return res.json({
        note: "Fetch any data from your application for authenticated user after using verifySession middleware",
        userId: req.session.getUserId(),
        sessionHandle: req.session.getHandle(),
        accessTokenPayload: req.session.getAccessTokenPayload(),
    });
}
exports.default = user;

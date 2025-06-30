"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const nextjs_1 = require("supertokens-node/nextjs");
const supertokens_node_1 = __importDefault(require("supertokens-node"));
const express_1 = require("supertokens-node/framework/express");
const backendConfig_1 = require("../../../config/backendConfig");
supertokens_node_1.default.init(backendConfig_1.SuperTokensConfig);
async function superTokens(req, res) {
    await (0, nextjs_1.superTokensNextWrapper)(
        async (next) => {
            res.setHeader("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
            await (0, express_1.middleware)()(req, res, next);
        },
        req,
        res
    );
    if (!res.writableEnded) {
        res.status(404).send("Not found");
    }
}
exports.default = superTokens;

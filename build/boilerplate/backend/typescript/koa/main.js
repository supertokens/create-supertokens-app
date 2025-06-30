"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const cors_1 = __importDefault(require("@koa/cors"));
const supertokens_node_1 = __importDefault(require("supertokens-node"));
const koa_2 = require("supertokens-node/framework/koa");
const config_1 = require("./config");
const koa_router_1 = __importDefault(require("koa-router"));
const koa_3 = require("supertokens-node/recipe/session/framework/koa");
const multitenancy_1 = __importDefault(require("supertokens-node/recipe/multitenancy"));
supertokens_node_1.default.init(config_1.SuperTokensConfig);
const app = new koa_1.default();
const router = new koa_router_1.default();
app.use(
    (0, cors_1.default)({
        origin: (0, config_1.getWebsiteDomain)(),
        allowHeaders: ["content-type", ...supertokens_node_1.default.getAllCORSHeaders()],
        credentials: true,
    })
);
// This exposes all the APIs from SuperTokens to the client.
app.use((0, koa_2.middleware)());
// This endpoint can be accessed regardless of
// having a session with SuperTokens
router.get("/hello", (ctx) => {
    ctx.body = "hello";
});
// An example API that requires session verification
router.get("/sessioninfo", (0, koa_3.verifySession)(), (ctx) => {
    const userId = ctx.session.getUserId();
    const sessionHandle = ctx.session.getHandle();
    const accessTokenPayload = ctx.session?.getAccessTokenPayload();
    ctx.body = JSON.stringify({ userId, sessionHandle, accessTokenPayload }, null, 4);
});
// This API is used by the frontend to create the tenants drop down when the app loads.
// Depending on your UX, you can remove this API.
router.get("/tenants", async (ctx) => {
    const tenants = await multitenancy_1.default.listAllTenants();
    ctx.body = tenants;
});
app.use(router.routes());
if (!module.parent) app.listen(3001, () => console.log("API Server listening on port 3001"));

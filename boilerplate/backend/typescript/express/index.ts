import express from "express";
import cors from "cors";
import supertokens from "supertokens-node";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { middleware, errorHandler, SessionRequest } from "supertokens-node/framework/express";
import { getWebsiteDomain, SuperTokensConfig } from "./config.js";
import Multitenancy from "supertokens-node/recipe/multitenancy";

supertokens.init(SuperTokensConfig);

const app = express();

app.use(
    cors({
        origin: getWebsiteDomain(),
        allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
        methods: ["GET", "PUT", "POST", "DELETE"],
        credentials: true,
    })
);

// This exposes all the APIs from SuperTokens to the client.
app.use(middleware());

// This endpoint can be accessed regardless of
// having a session with SuperTokens
app.get("/hello", async (_req, res) => {
    res.send("hello");
});

// An example API that requires session verification
app.get("/sessioninfo", verifySession(), async (req: SessionRequest, res) => {
    const session = req.session;
    res.send({
        sessionHandle: session!.getHandle(),
        userId: session!.getUserId(),
        accessTokenPayload: session!.getAccessTokenPayload(),
    });
});

// This API is used by the frontend to create the tenants drop down when the app loads.
// Depending on your UX, you can remove this API.
app.get("/tenants", async (_req, res) => {
    const tenants = await Multitenancy.listAllTenants();
    res.send(tenants);
});

// In case of session related errors, this error handler
// returns 401 to the client.
app.use(errorHandler());

app.listen(3001, () => console.log(`API Server listening on port 3001`));

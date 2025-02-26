// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import supertokens from "supertokens-node";
import { middleware } from "supertokens-node/framework/express";
import { SuperTokensConfig } from "../../../config/backendConfig";

supertokens.init(SuperTokensConfig);

export default async function superTokens(req, res) {
    await superTokensNextWrapper(
        async (next) => {
            res.setHeader("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
            await middleware()(req, res, next);
        },
        req,
        res
    );
    if (!res.writableEnded) {
        res.status(404).send("Not found");
    }
}

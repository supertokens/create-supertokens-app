import { SuperTokensConfig } from "../../config/backendConfig";
import SuperTokens from "supertokens-node";
import type { NextApiRequest, NextApiResponse } from "next";
import Multitenancy from "supertokens-node/recipe/multitenancy";

SuperTokens.init(SuperTokensConfig);

export default async function tenants(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET").status(405).end();
        return;
    }

    res.json(await Multitenancy.listAllTenants());
}

import { SuperTokensConfig } from "../../config/backendConfig";
import { NextApiRequest, NextApiResponse } from "next";
import Multitenancy from "supertokens-node/recipe/multitenancy";
import SuperTokens from "supertokens-node";

SuperTokens.init(SuperTokensConfig);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    return res.json(await Multitenancy.listAllTenants());
}

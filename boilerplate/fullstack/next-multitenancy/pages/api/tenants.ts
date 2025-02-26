import { SuperTokensConfig } from "../../config/backendConfig";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import supertokens from "supertokens-node";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import Multitenancy from "supertokens-node/recipe/multitenancy";

supertokens.init(SuperTokensConfig);

export default async function tenants(req, res) {
    return res.json(await Multitenancy.listAllTenants());
}

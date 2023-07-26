import supertokens from "supertokens-node";
import { backendConfig } from "../../config/backendConfig";
import Multitenancy from "supertokens-node/recipe/multitenancy";

supertokens.init(backendConfig());

export default async function tenants(req, res) {
    return res.json(await Multitenancy.listAllTenants());
}
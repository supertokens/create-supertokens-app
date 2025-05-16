import { SuperTokensConfig } from "../config/backendConfig";
import SuperTokens from "supertokens-node";
import { NextApiRequest, NextApiResponse } from "next";
import Multitenancy from "supertokens-node/recipe/multitenancy";

SuperTokens.init(SuperTokensConfig);

export async function GET(_: NextRequest) {
    return NextResponse.json(await Multitenancy.listAllTenants());
}

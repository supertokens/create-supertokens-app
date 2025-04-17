import { ensureSuperTokensInit } from "@/app/config/backendConfigUtils"; // Correct import path
import { NextResponse, NextRequest } from "next/server";
import Multitenancy from "supertokens-node/recipe/multitenancy";

ensureSuperTokensInit();

export async function GET(_: NextRequest) {
    return NextResponse.json(await Multitenancy.listAllTenants());
}

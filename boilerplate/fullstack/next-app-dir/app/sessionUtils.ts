import { serialize } from "cookie";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Session, { SessionContainer } from "supertokens-node/recipe/session";
import { ensureSuperTokensInit } from "./config/backend";
import {
  PreParsedRequest,
  CollectingResponse,
} from "supertokens-node/framework/custom";
import { HTTPMethod } from "supertokens-node/types";

ensureSuperTokensInit();

export async function getSSRSession(req?: NextRequest): Promise<{
  session: SessionContainer | undefined;
  hasToken: boolean;
  baseResponse: CollectingResponse;
  nextResponse?: NextResponse;
}> {
  const query =
    req !== undefined
      ? Object.fromEntries(new URL(req.url).searchParams.entries())
      : {};
  const parsedCookies: Record<string, string> = Object.fromEntries(
    (req !== undefined ? req.cookies : cookies())
      .getAll()
      .map((cookie) => [cookie.name, cookie.value])
  );
  let baseRequest = new PreParsedRequest({
    method: req !== undefined ? (req.method as HTTPMethod) : "get",
    url: req !== undefined ? req.url : "",
    query: query,
    headers: req !== undefined ? req.headers : headers(),
    cookies: parsedCookies,
    getFormBody: () => req!.formData(),
    getJSONBody: () => req!.json(),
  });

  let baseResponse = new CollectingResponse();

  try {
    let session = await Session.getSession(baseRequest, baseResponse);
    return {
      session,
      hasToken: session !== undefined,
      baseResponse,
    };
  } catch (err) {
    if (Session.Error.isErrorFromSuperTokens(err)) {
      return {
        hasToken: err.type !== Session.Error.UNAUTHORISED,
        session: undefined,
        baseResponse,
        nextResponse: new NextResponse("Authentication required", {
          status: err.type === Session.Error.INVALID_CLAIMS ? 403 : 401,
        }),
      };
    } else {
      throw err;
    }
  }
}

export async function withSession(
  request: NextRequest,
  handler: (session: SessionContainer | undefined) => Promise<NextResponse>
  // TODO: Add verify session options here and pass it to getSSRSession so that get session can get the options
  // TODO: Test header based auth and that custom headers are sent correctly
) {
  let { session, nextResponse, baseResponse } = await getSSRSession(request);
  if (nextResponse) {
    return nextResponse;
  }

  let userResponse = await handler(session);

  for (const respCookie of baseResponse.cookies) {
    userResponse.headers.append(
      "Set-Cookie",
      serialize(respCookie.key, respCookie.value, {
        domain: respCookie.domain,
        expires: new Date(respCookie.expires),
        httpOnly: respCookie.httpOnly,
        path: respCookie.path,
        sameSite: respCookie.sameSite,
        secure: respCookie.secure,
      })
    );
  }

  baseResponse.headers.forEach((value, key) => {
    userResponse.headers.set(key, value);
  });

  return userResponse;
}

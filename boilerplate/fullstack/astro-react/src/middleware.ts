import { defineMiddleware } from "astro:middleware";
import { getSessionForSSR } from "supertokens-node/custom";

// This middleware handles:
// 1. Auth routes (/auth/*)
// 2. Protected routes (/dashboard)
// 3. Session management
export const onRequest = defineMiddleware(async (context, next) => {
    const { request, url, redirect, locals } = context;

    // Get session information
    const { accessTokenPayload, hasToken, error } = await getSessionForSSR(request);

    // Add session info to locals for use in routes
    locals.session = {
        accessTokenPayload,
        hasToken,
        error,
    };

    // Handle auth routes
    if (url.pathname.startsWith("/auth")) {
        // If user is already logged in and tries to access auth pages, redirect to dashboard
        if (hasToken && !error) {
            return redirect("/dashboard");
        }
    }

    // Handle protected routes
    if (url.pathname.startsWith("/dashboard")) {
        // If user is not logged in, redirect to auth
        if (!hasToken || error) {
            return redirect("/auth");
        }
    }

    // Continue to route handling
    return next();
});

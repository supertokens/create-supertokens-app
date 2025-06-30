"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appInfo = exports.websiteDomain = void 0;
const port = process.env.APP_PORT || 3000;
const apiBasePath = "/api/auth/";
exports.websiteDomain = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${port}`;
exports.appInfo = {
    appName: "SuperTokens + Next.js",
    websiteDomain: exports.websiteDomain,
    apiDomain: exports.websiteDomain,
    apiBasePath,
};

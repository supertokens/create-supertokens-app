import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { websitePort } from "./app/config/frontend";

installGlobals();

export default defineConfig({
    server: {
        port: websitePort,
    },
    plugins: [
        remix({
            ignoredRouteFiles: ["**/*.css"],
        }),
        tsconfigPaths(),
    ],
    define: {
        "process.env": {},
    },
});

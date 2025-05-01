import { defineConfig } from "astro/config";
import node from "@astrojs/node";

import { websitePort } from "./src/config/frontend";

// https://astro.build/config
export default defineConfig({
    output: "server",
    adapter: node({
        mode: "standalone",
    }),
    server: {
        port: websitePort,
    },
});

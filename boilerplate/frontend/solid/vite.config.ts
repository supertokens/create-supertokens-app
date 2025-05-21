import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { websitePort } from "./src/config";

export default defineConfig({
    plugins: [solid()],
    server: {
        port: websitePort,
        host: "localhost",
        open: "/",
    },
    optimizeDeps: {
        force: true,
    },
    resolve: {
        preserveSymlinks: true,
    },
});

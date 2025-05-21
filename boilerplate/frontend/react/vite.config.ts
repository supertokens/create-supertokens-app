import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { websitePort } from "./src/config";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        force: true,
    },
    resolve: {
        preserveSymlinks: true,
    },
    server: {
        port: websitePort,
    },
});

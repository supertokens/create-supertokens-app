import { defineConfig } from "vitest/config";
export default defineConfig({
    test: {
        include: ["tests/**/*.test.ts"],
        testTimeout: 310000,
        hookTimeout: 60000,
    },
});

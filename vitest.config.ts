import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        // Include all tests in the tests/ directory
        include: ["tests/**/*.test.ts"],
        // exclude: [ ... ], // Keep exclude commented or remove if include is sufficient
        testTimeout: 310000, // Restore longer timeout for E2E tests
        hookTimeout: 60000, // Restore longer hook timeout
    },
});

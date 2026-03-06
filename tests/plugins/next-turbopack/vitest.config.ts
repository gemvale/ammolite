import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        logHeapUsage: true,
        testTimeout: 60 * 1000,
    },
});

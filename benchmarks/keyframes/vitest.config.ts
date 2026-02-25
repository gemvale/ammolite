import tsconfigPath from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    optimizeDeps: {
        exclude: [
            "@ammolite/integration",
            "ammolite",
        ],
    },
    test: {
        logHeapUsage: true,
    },
    plugins: [
        tsconfigPath(),
    ],
});

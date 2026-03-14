import { defineConfig } from "@apst/tsdown";
import { cjsPreset, dtsPreset, esmPreset } from "@apst/tsdown/presets";

export default defineConfig(
    {
        entry: {
            // public
            "rollup/index": "./src/bundlers/rollup/index.ts",
            "vite/index": "./src/bundlers/vite/index.ts",
            "webpack/index": "./src/bundlers/webpack/index.ts",
            // internal
            "rollup/create": "./src/bundlers/rollup/create.ts",
            "vite/create": "./src/bundlers/vite/create.ts",
            "webpack/create": "./src/bundlers/webpack/create.ts",
            // required
            hmr: "./src/plugins/vite/hmr/hmr.ts",
            // extra
            "webpack/loader": "./src/bundlers/webpack/loader.ts",
        },
        platform: "node",
    },
    [
        cjsPreset({
            inputOptions: {
                transform: {
                    define: {
                        // Vite HMR
                        "import.meta": `{}`,
                    },
                },
            },
        }),
        esmPreset(),
        dtsPreset({
            presetOptions: {
                performanceMode: true,
            },
        }),
    ],
);

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
            "plugins/vite/hmr/hmr": "./src/plugins/vite/hmr/hmr.ts",
            // extra
            "webpack/loader": "./src/bundlers/webpack/loader.ts",
        },
        platform: "node",
        shims: false,
        unbundle: true,
    },
    [
        cjsPreset({
            inputOptions: {
                transform: {
                    define: {
                        "import.meta.dirname": "__dirname",
                        "import.meta.url": "__filename",
                        "import.meta": "{}",
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

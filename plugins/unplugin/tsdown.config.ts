import { defineConfig } from "@apst/tsdown";
import { cjsPreset, dtsPreset, esmPreset } from "@apst/tsdown/presets";

export default defineConfig(
    {
        entry: {
            // public
            "webpack/index": "./src/bundlers/webpack/index.ts",
            "rspack/index": "./src/bundlers/rspack/index.ts",
            "rollup/index": "./src/bundlers/rollup/index.ts",
            "vite/index": "./src/bundlers/vite/index.ts",
            // internal
            "webpack/create": "./src/bundlers/webpack/create.ts",
            "rspack/create": "./src/bundlers/rspack/create.ts",
            "rollup/create": "./src/bundlers/rollup/create.ts",
            "vite/create": "./src/bundlers/vite/create.ts",
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

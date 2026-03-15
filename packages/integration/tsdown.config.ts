import { defineConfig } from "@apst/tsdown";
import { cjsPreset, dtsPreset, esmPreset } from "@apst/tsdown/presets";

export default defineConfig(
    {
        entry: {
            "runtime/index": "./src/runtime/index.ts",
            "cache/index": "./src/cache/index.ts",
            "filter/index": "./src/filter/index.ts",
            "log/index": "./src/log/index.ts",
        },
        platform: "node",
        unbundle: true,
    },
    [
        esmPreset(),
        cjsPreset(),
        dtsPreset({
            presetOptions: {
                performanceMode: true,
            },
        }),
    ],
);

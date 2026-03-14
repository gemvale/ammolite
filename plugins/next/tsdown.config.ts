import { defineConfig } from "@apst/tsdown";
import { cjsPreset, dtsPreset, esmPreset } from "@apst/tsdown/presets";

export default defineConfig(
    {
        entry: {
            webpack: "./src/webpack.ts",
            turbopack: "./src/turbopack.ts",
        },
        platform: "node",
    },
    [
        cjsPreset(),
        esmPreset(),
        dtsPreset({
            presetOptions: {
                performanceMode: true,
            },
        }),
    ],
);

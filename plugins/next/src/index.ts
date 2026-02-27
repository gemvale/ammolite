import type { LoaderOptions } from "@ammolite/unplugin/webpack/loader";
import type { NextConfig } from "next";

import { toMerged } from "es-toolkit";

type PluginOptions = LoaderOptions;

const plugin = (
    options?: PluginOptions,
): ((nextConfig: NextConfig) => NextConfig) => {
    return (nextConfig: NextConfig): NextConfig => {
        return toMerged(nextConfig, {
            turbopack: {
                rules: {
                    "*.{js,jsx,ts,tsx}": {
                        loaders: [
                            {
                                loader: "@ammolite/unplugin/webpack/loader",
                                options: {
                                    cwd: options?.cwd ?? "",
                                    include: (options?.include ??
                                        []) as string[],
                                    exclude: (options?.exclude ??
                                        []) as string[],
                                },
                            },
                        ],
                    },
                },
            },
        } satisfies NextConfig);
    };
};

export type { PluginOptions };
export { plugin as ammolite };

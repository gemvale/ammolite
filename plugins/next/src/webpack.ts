import type { PluginOptions as RawPluginOptions } from "@ammolite/unplugin/webpack";
import type { NextConfig } from "next";
import type { WebpackConfigContext } from "next/dist/server/config-shared";
import type { Format, Omit } from "ts-vista";
import type { Configuration } from "webpack";

import { AmmolitePlugin } from "@ammolite/unplugin/webpack";

type PluginOptions = Format<Omit<RawPluginOptions, "emit" | "output">>;

const plugin = (
    options?: PluginOptions,
): ((nextConfig?: NextConfig) => NextConfig) => {
    return (nextConfig?: NextConfig): NextConfig => {
        return {
            ...nextConfig,
            webpack(wpConfig: Configuration, ctx: WebpackConfigContext) {
                const cfg: Configuration = {
                    ...wpConfig,
                    plugins: [
                        ...(wpConfig.plugins ?? []),
                        new AmmolitePlugin({
                            ...options,
                            emit: false,
                        }),
                    ],
                };

                if (typeof nextConfig?.webpack === "function") {
                    return nextConfig.webpack(cfg, ctx);
                }

                return cfg;
            },
        } satisfies NextConfig;
    };
};

export type { PluginOptions };
export { plugin as ammolite };

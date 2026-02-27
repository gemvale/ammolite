import type { CreatePluginOptions as CreateWebpackPluginOptions } from "@ammolite/unplugin/webpack/create";
import type {
    RsbuildConfig,
    RsbuildPlugin,
    RsbuildPluginAPI,
} from "@rsbuild/core";

import type { PluginOptions } from "#/@types/options";

import * as Path from "node:path";

import { createPlugin as createWebpackPlugin } from "@ammolite/unplugin/webpack/create";

import { name, version } from "../package.json";

type CreatePluginOptions = CreateWebpackPluginOptions;

const getFileName = (
    rsbuildConfig: RsbuildConfig,
    options?: PluginOptions,
): string => {
    const isDev: boolean = process.env.NODE_ENV === "development";

    const parsedPath: Path.ParsedPath = Path.parse(
        options?.output?.fileName ?? "index",
    );

    const ext: string = parsedPath.ext === "" ? ".css" : parsedPath.ext;

    let fileName: string = `${parsedPath.name}${ext}`;

    if (isDev) return fileName;

    const filenameHash: string | boolean | undefined =
        rsbuildConfig.output?.filenameHash;

    if (typeof filenameHash === "boolean" && filenameHash === true) {
        fileName = `${parsedPath.name}.[contenthash:8]${ext}`;
    } else if (typeof filenameHash === "string") {
        fileName = `${parsedPath.name}.[${filenameHash}]${ext}`;
    }

    return fileName;
};

const createPlugin = (createOptions?: CreatePluginOptions) => {
    return (options?: PluginOptions): RsbuildPlugin => {
        return {
            name,
            async setup(api: RsbuildPluginAPI): Promise<void> {
                const Plugin = createWebpackPlugin({
                    name: createOptions?.name ?? name,
                    version: createOptions?.version ?? version,
                    runtime: createOptions?.runtime,
                });

                api.modifyRsbuildConfig(
                    (
                        userConfig: RsbuildConfig,
                        { mergeRsbuildConfig },
                    ): RsbuildConfig => {
                        const config: RsbuildConfig = {
                            tools: {
                                rspack: {
                                    plugins: [
                                        new Plugin({
                                            ...options,
                                            output: {
                                                dir:
                                                    userConfig.output?.distPath
                                                        ?.css ?? "./static/css",
                                                fileName: getFileName(
                                                    userConfig,
                                                    options,
                                                ),
                                            },
                                        }),
                                    ],
                                },
                            },
                        };

                        return mergeRsbuildConfig(userConfig, config);
                    },
                );
            },
        };
    };
};

type Plugin = ReturnType<typeof createPlugin>;

export type { CreatePluginOptions, Plugin };
export { createPlugin };

import type { CreatePluginOptions as _CreatePluginOptions } from "@ammolite/unplugin/rspack/create";
import type {
    DistPathConfig,
    RsbuildConfig,
    RsbuildPlugin,
    RsbuildPluginAPI,
} from "@rsbuild/core";

import type { PluginOptions } from "#/@types/options";

import * as Path from "node:path";

import { createPlugin as _createPlugin } from "@ammolite/unplugin/rspack/create";

import { name } from "../package.json";

type CreatePluginOptions = _CreatePluginOptions;

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
                const Plugin = _createPlugin({
                    name: createOptions?.name ?? name,
                    runtime: createOptions?.runtime,
                });

                api.modifyRsbuildConfig(
                    (
                        userConfig: RsbuildConfig,
                        { mergeRsbuildConfig },
                    ): RsbuildConfig => {
                        const distPath: string | DistPathConfig | undefined =
                            userConfig.output?.distPath;

                        const dir: string =
                            typeof distPath === "string"
                                ? distPath
                                : (distPath?.css ?? "./static/css");

                        const config: RsbuildConfig = {
                            tools: {
                                rspack: {
                                    plugins: [
                                        new Plugin({
                                            ...options,
                                            output: {
                                                ...userConfig.output,
                                                dir,
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

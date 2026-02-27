import type { Runtime } from "@ammolite/integration/runtime";
import type { UnpluginFactory, UnpluginOptions } from "unplugin";
import type { Plugin as VitePlugin } from "vite";

import type { CreatePluginOptions } from "#/@types/create";
import type { PluginOptions } from "#/@types/options";

import { createRuntime } from "@ammolite/integration/runtime";
import { createUnplugin } from "unplugin";

import { cachePlugin } from "#/plugins/cache";
import { compilePlugin } from "#/plugins/compile";
import { emitPlugin } from "#/plugins/rollup/emit";
import { hmrPlugin } from "#/plugins/vite/hmr";
import { htmlPlugin } from "#/plugins/vite/html";
import { name as pkgName, version as pkgVersion } from "#/root/package.json";

type Plugin = (options?: PluginOptions) => VitePlugin | VitePlugin[];

const createPlugin = (createOptions?: CreatePluginOptions): Plugin => {
    const name: string = createOptions?.name ?? pkgName;
    const version: string = createOptions?.version ?? pkgVersion;

    const factory: UnpluginFactory<PluginOptions | undefined> = (
        options?: PluginOptions,
    ): UnpluginOptions[] => {
        const emit: boolean =
            typeof options?.emit === "boolean" ? options.emit : true;

        const dev: boolean =
            typeof options?.dev === "boolean"
                ? options.dev
                : process.env.NODE_ENV === "development";

        const runtime: Runtime =
            createOptions?.runtime ??
            createRuntime({
                cwd: options?.cwd,
                include: options?.input?.include,
                exclude: options?.input?.exclude,
            });

        const compiler: UnpluginOptions = compilePlugin({
            name,
            runtime,
        });

        const cache: UnpluginOptions = cachePlugin({
            name,
            runtime,
            cwd: options?.cwd,
        });

        if (dev) {
            return [
                // compile
                {
                    ...compiler,
                    vite: {
                        ...compiler.vite,
                        version,
                    },
                },
                // cache
                {
                    ...cache,
                    vite: {
                        ...cache.vite,
                        version,
                    },
                },
                // hmr
                ...hmrPlugin({
                    name,
                    version,
                    emit,
                    runtime,
                }),
            ];
        }

        return [
            // compile
            {
                ...compiler,
                vite: {
                    ...compiler.vite,
                    version,
                },
            },
            // cache
            {
                ...cache,
                vite: {
                    ...cache.vite,
                    version,
                },
            },
            // emit
            emitPlugin({
                name,
                version,
                emit,
                runtime,
                cwd: options?.cwd,
                output: options?.output,
            }),
            // html inject
            htmlPlugin({
                name,
                version,
                emit,
                cwd: options?.cwd,
                output: options?.output,
            }),
        ];
    };

    return createUnplugin(factory).vite;
};

export type { CreatePluginOptions, Plugin };
export { createPlugin };

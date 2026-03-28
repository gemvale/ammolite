import type { Logger } from "@ammolite/integration/log";
import type { Runtime } from "@ammolite/integration/runtime";
import type { UnpluginFactory, UnpluginOptions } from "unplugin";
import type { Plugin as VitePlugin } from "vite";

import type { CreatePluginOptions } from "#/@types/create";
import type { PluginOptions } from "#/@types/options";

import { createLogger } from "@ammolite/integration/log";
import { createRuntime } from "@ammolite/integration/runtime";
import { createUnplugin } from "unplugin";
import { version as viteVersion } from "vite";

import { cachePlugin } from "#/plugins/cache";
import { compilePlugin } from "#/plugins/compile";
import { emitPlugin } from "#/plugins/rollup/emit";
import { hmrPlugin } from "#/plugins/vite/hmr";
import { htmlPlugin } from "#/plugins/vite/html";
import { watchConfigPlugin } from "#/plugins/vite/watch-config";
import { name as pkgName } from "#/root/package.json";

type Plugin = (options?: PluginOptions) => VitePlugin | VitePlugin[];

const createPlugin = (createOptions?: CreatePluginOptions): Plugin => {
    const name: string = createOptions?.name ?? pkgName;

    const factory: UnpluginFactory<PluginOptions | undefined> = (
        options?: PluginOptions,
    ): UnpluginOptions[] => {
        const emit: boolean =
            typeof options?.emit === "boolean" ? options.emit : true;

        const cwd: string | undefined = options?.cwd;

        const dev: boolean =
            typeof options?.dev === "boolean"
                ? options.dev
                : process.env.NODE_ENV === "development";

        const runtime: Runtime =
            createOptions?.runtime ??
            createRuntime({
                bundler: {
                    name: "vite",
                    version: viteVersion,
                },
                cwd,
                include: options?.input?.include,
                exclude: options?.input?.exclude,
                tsconfigPath: options?.input?.tsconfigPath,
            });

        const logger: Logger = createLogger({
            cwd,
            fileName: name,
        });

        const watchConfig: UnpluginOptions[] = watchConfigPlugin({
            logger,
            name,
        });

        const compiler: UnpluginOptions[] = compilePlugin({
            logger,
            name,
            runtime,
        });

        const cache: UnpluginOptions[] = cachePlugin({
            logger,
            emit,
            name,
            runtime,
            cwd,
        });

        if (dev) {
            return [
                // watch config
                ...watchConfig,
                // compile
                ...compiler,
                // cache
                ...cache,
                // hmr
                ...hmrPlugin({
                    logger,
                    name,
                    emit,
                    runtime,
                }),
            ];
        }

        return [
            // watch config
            ...watchConfig,
            // compile
            ...compiler,
            // cache
            ...cache,
            // emit
            ...emitPlugin({
                logger,
                name,
                emit,
                runtime,
                output: options?.output,
            }),
            // html inject
            ...htmlPlugin({
                logger,
                name,
                emit,
                output: options?.output,
            }),
        ];
    };

    // biome-ignore lint/suspicious/noTsIgnore: vite version unmatched
    // @ts-ignore vite version unmatched
    return createUnplugin(factory).vite;
};

export type { CreatePluginOptions, Plugin };
export { createPlugin };

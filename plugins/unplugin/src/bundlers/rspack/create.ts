import type { Logger } from "@ammolite/integration/log";
import type { Runtime } from "@ammolite/integration/runtime";
import type { Compiler } from "@rspack/core";
import type { Format, Omit } from "ts-vista";
import type {
    RspackPluginInstance,
    UnpluginFactory,
    UnpluginOptions,
} from "unplugin";

import type { CreatePluginOptions } from "#/@types/create";
import type { PluginOptions as RawPluginOptions } from "#/@types/options";

import { createLogger } from "@ammolite/integration/log";
import { createRuntime } from "@ammolite/integration/runtime";
import { createUnplugin } from "unplugin";

import { cachePlugin } from "#/plugins/cache";
import { compilePlugin } from "#/plugins/compile";
import { emitPlugin } from "#/plugins/webpack/emit";
import { htmlPlugin } from "#/plugins/webpack/html";
import { watchConfigPlugin } from "#/plugins/webpack/watch-config";
import { name as pkgName } from "#/root/package.json";

type PluginOptions = Format<Omit<RawPluginOptions, "dev">>;

type Plugin = {
    new (options?: PluginOptions): RspackPluginInstance;
};

const createPlugin = (createOptions?: CreatePluginOptions): Plugin => {
    const name: string = createOptions?.name ?? pkgName;

    const factory: UnpluginFactory<PluginOptions | undefined> = (
        options?: PluginOptions,
    ): UnpluginOptions[] => {
        const emit: boolean =
            typeof options?.emit === "boolean" ? options.emit : true;

        const cwd: string | undefined = options?.cwd;

        const runtime: Runtime =
            createOptions?.runtime ??
            createRuntime({
                cwd,
                include: options?.input?.include,
                exclude: options?.input?.exclude,
            });

        const logger: Logger = createLogger({
            cwd,
            fileName: name,
        });

        return [
            // watch config
            ...watchConfigPlugin({
                logger,
                name,
            }),
            // compile
            ...compilePlugin({
                logger,
                name,
                runtime,
            }),
            // cache
            ...cachePlugin({
                logger,
                emit,
                name,
                runtime,
                cwd,
            }),
            // emit
            ...emitPlugin({
                logger,
                name,
                emit,
                runtime,
                output: options?.output,
            }),
            // html
            ...htmlPlugin({
                logger,
                name,
                emit,
                runtime,
                output: options?.output,
            }),
        ];
    };

    class PluginInstance implements RspackPluginInstance {
        private readonly plugin: RspackPluginInstance;

        constructor(options?: PluginOptions) {
            this.plugin = createUnplugin(factory).rspack(options);
        }

        apply(compiler: Compiler): void {
            this.plugin.apply(compiler);
        }
    }

    return PluginInstance;
};

export type { CreatePluginOptions, Plugin, PluginOptions };
export { createPlugin };

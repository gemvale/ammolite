import type { Logger } from "@ammolite/integration/log";
import type { Runtime } from "@ammolite/integration/runtime";
import type { Plugin as RollPlugin } from "rollup";
import type { Format, Omit } from "ts-vista";
import type { UnpluginFactory, UnpluginOptions } from "unplugin";

import type { CreatePluginOptions } from "#/@types/create";
import type { PluginOptions as RawPluginOptions } from "#/@types/options";

import { createLogger } from "@ammolite/integration/log";
import { createRuntime } from "@ammolite/integration/runtime";
import { createUnplugin } from "unplugin";

import { cachePlugin } from "#/plugins/cache";
import { compilePlugin } from "#/plugins/compile";
import { emitPlugin } from "#/plugins/rollup/emit";
import { name as pkgName } from "#/root/package.json";

type PluginOptions = Format<Omit<RawPluginOptions, "dev">>;

type Plugin = (options?: PluginOptions) => RollPlugin | RollPlugin[];

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
        ];
    };

    return createUnplugin(factory).rollup;
};

export type { CreatePluginOptions, Plugin, PluginOptions };
export { createPlugin };

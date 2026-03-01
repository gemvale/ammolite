import type { Logger } from "@ammolite/integration/log";
import type { PluginCreator } from "postcss";
import type { Format, Partial } from "ts-vista";

import type { PluginOptions } from "#/@types/options";

import { createLogger } from "@ammolite/integration/log";

import { cachePlugin } from "#/plugins/cache";
import { name as pkgName } from "../package.json";

type CompleteCreatePluginOptions = {
    name: string;
};

type CreatePluginOptions = Format<Partial<CompleteCreatePluginOptions>>;

const createPlugin = (
    createOptions?: CreatePluginOptions,
): PluginCreator<PluginOptions> => {
    const name: string = createOptions?.name ?? pkgName;

    const plugin: PluginCreator<PluginOptions> = (options?: PluginOptions) => {
        const cwd: string = options?.cwd ?? process.cwd();

        const emit: boolean =
            typeof options?.emit === "boolean" ? options.emit : true;

        const logger: Logger = createLogger({
            cwd,
            fileName: name,
        });

        return {
            postcssPlugin: name,
            plugins: [
                ...cachePlugin({
                    logger,
                    name,
                    emit,
                    cwd,
                }),
            ],
        };
    };

    plugin.postcss = true;

    return plugin;
};

type Plugin = ReturnType<typeof createPlugin>;

export type { CreatePluginOptions, Plugin };
export { createPlugin };

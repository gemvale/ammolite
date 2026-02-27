// import type { Runtime } from "@ammolite/integration/runtime";
import type { PluginCreator } from "postcss";
import type { Format, Partial } from "ts-vista";

import type { PluginOptions } from "#/@types/options";

import { cachePlugin } from "#/plugins/cache";
import { name as pkgName } from "../package.json";

type CompleteCreatePluginOptions = {
    name: string;
    // runtime: Runtime;
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

        return {
            postcssPlugin: name,
            plugins: [
                ...cachePlugin({
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

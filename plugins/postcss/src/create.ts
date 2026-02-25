import type { Runtime } from "@ammolite/integration/runtime";
import type { PluginCreator, Root } from "postcss";
import type { Format, Partial } from "ts-vista";

import type { PluginOptions } from "#/@types/options";

import * as Fsp from "node:fs/promises";

import { createRuntime } from "@ammolite/integration/runtime";

import { getPaths } from "#/functions/path";
import { name } from "../package.json";

type CompleteCreatePluginOptions = {
    name: string;
    runtime: Runtime;
};

type CreatePluginOptions = Format<Partial<CompleteCreatePluginOptions>>;

const FILE_PARENT = "ammolite.css" as const;

const createPlugin = (
    createOptions?: CreatePluginOptions,
): PluginCreator<PluginOptions> => {
    const plugin: PluginCreator<PluginOptions> = (options?: PluginOptions) => {
        const cwd: string = options?.cwd ?? process.cwd();

        const include: readonly string[] =
            typeof options?.input?.include === "undefined"
                ? [
                      "./src",
                  ]
                : options.input.include;

        const runtime: Runtime =
            createOptions?.runtime ??
            createRuntime({
                cwd,
                include,
                exclude: options?.input?.exclude,
            });

        return {
            postcssPlugin: createOptions?.name ?? name,
            async Once(root: Root, { postcss, result }): Promise<void> {
                const emit: boolean = options?.emit ?? true;

                if (!emit) return void 0;

                const included: string[] = await getPaths({
                    cwd,
                    paths: include,
                });

                for await (const file of included) {
                    // compile
                    await runtime.compile({
                        file,
                        code: await Fsp.readFile(file, "utf-8"),
                    });

                    // add dependency
                    result.messages.push({
                        type: "dependency",
                        plugin: name,
                        file,
                        parent: FILE_PARENT,
                    });
                }

                // append result
                root.append(
                    postcss.parse(await runtime.getCSS(), {
                        from: FILE_PARENT,
                    }),
                );
            },
        };
    };

    plugin.postcss = true;

    return plugin;
};

type Plugin = ReturnType<typeof createPlugin>;

export type { CreatePluginOptions, Plugin };
export { createPlugin };

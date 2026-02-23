import type { Runtime } from "@ammolite/runtime";
import type { PluginCreator, Root } from "postcss";
import type { Format, Partial } from "ts-vista";

import type { PluginOptions } from "#/@types/options";

import * as Fsp from "node:fs/promises";

import { createRuntime } from "@ammolite/runtime";

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
            options?.input?.include && (options.input.include.length ?? 0) > 0
                ? options.input.include
                : [
                      "./src",
                  ];

        const exclude: readonly string[] =
            options?.input?.exclude && (options.input.exclude.length ?? 0) > 0
                ? options.input.exclude
                : [];

        const runtime: Runtime =
            createOptions?.runtime ??
            createRuntime({
                cwd,
                include,
                exclude,
            });

        return {
            postcssPlugin: createOptions?.name ?? name,
            async Once(root: Root, { postcss, result }): Promise<void> {
                const emit: boolean = options?.emit ?? true;

                if (!emit) return void 0;

                const included: string[] = await getPaths({
                    cwd,
                    paths: include ?? [
                        "./src",
                    ],
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

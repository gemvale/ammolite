import type { KeyValueCache } from "@ammolite/integration/cache";
import type { Plugin, Root, TransformCallback, Transformer } from "postcss";
import type { Format, Partial } from "ts-vista";

import { readCaches } from "@ammolite/integration/cache";

const FILE = "ammolite.css" as const;

type CompleteCachePluginOptions = {
    name: string;
    emit: boolean;
    cwd: string;
};

type CachePluginOptions = Format<Partial<CompleteCachePluginOptions, "cwd">>;

const cachePlugin = (
    options: CachePluginOptions,
): (Plugin | TransformCallback | Transformer)[] => {
    const name: string = options.name;

    return [
        {
            postcssPlugin: `${name}/cache`,
            async Once(root: Root, { postcss }): Promise<void> {
                if (!options.emit) return void 0;

                const result: KeyValueCache[] = await readCaches({
                    cwd: options.cwd,
                });

                if (result.length === 0) return void 0;

                for (const cache of result) {
                    const css: string = cache.value.css;

                    root.append(
                        postcss.parse(css, {
                            from: FILE,
                        }),
                    );
                }
            },
        },
    ];
};

export type { CachePluginOptions };
export { cachePlugin };

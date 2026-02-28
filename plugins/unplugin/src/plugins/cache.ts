/**
 * This is a caching plugin for collaboration with PostCSS plugin.
 */

import type { Runtime } from "@ammolite/integration/runtime";
import type { Format, Partial } from "ts-vista";
import type { UnpluginOptions } from "unplugin";

import { clearCache, writeCache } from "@ammolite/integration/cache";
import { FILTER_JS_ADVANCED } from "@ammolite/integration/filter";

type CompleteCachePluginOptions = {
    name: string;
    cwd: string;
    runtime: Runtime;
};

type CachePluginOptions = Format<Partial<CompleteCachePluginOptions, "cwd">>;

const cachePlugin = ({
    name,
    cwd,
    runtime,
}: CachePluginOptions): UnpluginOptions[] => {
    return [
        {
            name: `${name}/cache/clear`,
            enforce: "pre",
            async buildStart(): Promise<void> {
                await clearCache({
                    cwd,
                });
            },
            async watchChange(): Promise<void> {
                // clear cache, avoid the reader to read previous cache
                await clearCache({
                    cwd,
                });
            },
        },
        {
            name: `${name}/cache/write`,
            transform: {
                filter: {
                    id: {
                        include: [
                            FILTER_JS_ADVANCED,
                        ],
                    },
                },
                async handler(_code: string, id: string): Promise<void> {
                    const file: string = id;

                    const result: string | undefined = await runtime.getCSS({
                        file,
                    });

                    if (!result) return void 0;

                    await writeCache({
                        cwd,
                        file,
                        css: result,
                    });
                },
            },
        },
    ];
};

export type { CachePluginOptions };
export { cachePlugin };

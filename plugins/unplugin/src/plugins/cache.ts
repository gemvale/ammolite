/**
 * This is a caching plugin for collaboration with other CSS processors.
 */

import type { Logger } from "@ammolite/integration/log";
import type { Runtime } from "@ammolite/integration/runtime";
import type { Format, Partial } from "ts-vista";
import type { UnpluginOptions } from "unplugin";

import { clearCaches, writeCache } from "@ammolite/integration/cache";
import { FILTER_JS_ADVANCED } from "@ammolite/integration/filter";

type CompleteCachePluginOptions = {
    logger: Logger;
    emit: boolean;
    name: string;
    cwd: string;
    runtime: Runtime;
};

type CachePluginOptions = Format<Partial<CompleteCachePluginOptions, "cwd">>;

const cachePlugin = ({
    emit,
    name,
    cwd,
    runtime,
}: CachePluginOptions): UnpluginOptions[] => {
    /**
     *  emit: render css directly
     * !emit: cache css for other processors
     */
    if (emit) return [];

    return [
        {
            name: `${name}/cache/clear`,
            enforce: "pre",
            async buildStart(): Promise<void> {
                await clearCaches({
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

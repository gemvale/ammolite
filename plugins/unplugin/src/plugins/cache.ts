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
    runtime: Runtime;
    cwd: string;
};

type CachePluginOptions = Format<Partial<CompleteCachePluginOptions, "cwd">>;

const cachePlugin = ({
    name,
    runtime,
    cwd,
}: CachePluginOptions): UnpluginOptions => {
    return {
        name: `${name}/cache`,
        enforce: "post",
        async buildStart(): Promise<void> {
            await clearCache({
                cwd,
            });
        },
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
    };
};

export type { CachePluginOptions };
export { cachePlugin };

import type { KeyValueCache } from "@ammolite/integration/cache";
import type { Plugin, Root, TransformCallback, Transformer } from "postcss";
import type { Format, Partial } from "ts-vista";

import { readCaches } from "@ammolite/integration/cache";

const FILE = "ammolite.css" as const;

const RETRY_MAX = 6 as const;

const RETRY_DELAY_BASE = 50 as const;

const wait = (ms: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

type CompleteReadCachesWithRetryOptions = {
    cwd: string;
};

type ReadCachesWithRetryOptions = Format<
    Partial<CompleteReadCachesWithRetryOptions, "cwd">
>;

const readCachesWithRetry = async ({
    cwd,
}: ReadCachesWithRetryOptions): Promise<KeyValueCache[]> => {
    let attempt: number = 0;

    while (attempt < RETRY_MAX) {
        const result: KeyValueCache[] = await readCaches({
            cwd,
        });

        if (result.length > 0) {
            return result;
        }

        attempt += 1;

        if (attempt < RETRY_MAX) {
            await wait(RETRY_DELAY_BASE * 2 ** attempt);
        }
    }

    return [];
};

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

                const result: KeyValueCache[] = await readCachesWithRetry({
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

import type { KeyValueCache } from "@ammolite/integration/cache";
import type { Logger } from "@ammolite/integration/log";
import type { Plugin, Root, TransformCallback, Transformer } from "postcss";
import type { Format, Partial } from "ts-vista";

import {
    readCaches,
    resolveCacheSignalFile,
} from "@ammolite/integration/cache";

const FILE = "ammolite.css" as const;

const RETRY_MAX = 6 as const;

const RETRY_DELAY_BASE = 50 as const;

const wait = (ms: number): Promise<void> => {
    return new Promise((resolve): void => {
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
            // incremental delay: 50ms, 100ms, 200ms, 400ms
            await wait(RETRY_DELAY_BASE * 2 ** attempt);
        }
    }

    return [];
};

type CompleteCachePluginOptions = {
    logger: Logger;
    name: string;
    emit: boolean;
    cwd: string;
};

type CachePluginOptions = Format<Partial<CompleteCachePluginOptions, "cwd">>;

const cachePlugin = ({
    name,
    emit,
    cwd,
}: CachePluginOptions): (Plugin | TransformCallback | Transformer)[] => {
    const signalFile: string = resolveCacheSignalFile({
        cwd,
    });

    return [
        // initialize
        {
            postcssPlugin: `${name}/cache/read`,
            async Once(root: Root, { postcss }): Promise<void> {
                if (!emit) return void 0;

                const result: KeyValueCache[] = await readCachesWithRetry({
                    cwd,
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
        // watch signal
        {
            postcssPlugin: `${name}/cache/signal`,
            async Once(_: Root, { result }): Promise<void> {
                result.messages.push({
                    type: "dependency",
                    plugin: name,
                    file: signalFile,
                    parent: result.opts.from,
                });
            },
        },
    ];
};

export type { CachePluginOptions };
export { cachePlugin };

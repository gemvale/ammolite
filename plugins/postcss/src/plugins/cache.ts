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

const RETRY_STABLE_MAX = 9 as const;
const RETRY_STABLE_DELAY = 25 as const;
const RETRY_STABLE_SNAPSHOT_MIN = 3 as const;

const wait = (ms: number): Promise<void> => {
    return new Promise((resolve): void => {
        setTimeout(resolve, ms);
    });
};

const toSortedCacheKeys = (result: KeyValueCache[]): string[] => {
    const keys: string[] = result.map(
        (cache: KeyValueCache): string => cache.key,
    );

    keys.sort((left: string, right: string): number => {
        return left.localeCompare(right);
    });

    return keys;
};

const isSameStringList = (left: string[], right: string[]): boolean => {
    if (left.length !== right.length) {
        return false;
    }

    for (let i: number = 0; i < left.length; i++) {
        if (left[i] !== right[i]) {
            return false;
        }
    }

    return true;
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

    let attemptStable: number = 0;

    let snapshot: number = 0;

    let previousCacheKeys: string[] = [];

    let bestResult: KeyValueCache[] = [];

    while (attempt < RETRY_MAX && attemptStable < RETRY_STABLE_MAX) {
        const result: KeyValueCache[] = await readCaches({
            cwd,
        });

        const currentCacheKeys: string[] = toSortedCacheKeys(result);

        // not yet stable / nothing written
        if (result.length === 0) {
            snapshot = 0;
            attemptStable = 0;
            previousCacheKeys = [];

            attempt += 1;

            if (attempt < RETRY_MAX) {
                // incremental delay: 50ms, 100ms, 200ms, 400ms
                await wait(RETRY_DELAY_BASE * 2 ** attempt);
            }

            continue;
        }

        // check if it is a more completed result
        if (result.length >= bestResult.length) {
            bestResult = result;
        }

        const isSnapshotStable: boolean = isSameStringList(
            previousCacheKeys,
            currentCacheKeys,
        );

        if (isSnapshotStable) {
            snapshot += 1;
        } else {
            snapshot = 0;
        }

        previousCacheKeys = currentCacheKeys;

        // stable enough
        if (snapshot >= RETRY_STABLE_SNAPSHOT_MIN) {
            return result;
        }

        attemptStable += 1;

        // get more snapshots
        if (attemptStable < RETRY_STABLE_MAX) {
            await wait(RETRY_STABLE_DELAY);
        }
    }

    return bestResult;
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

                const combined: string = result
                    .map((c: KeyValueCache): string => c.value.css)
                    .join("");

                root.append(
                    postcss.parse(combined, {
                        from: FILE,
                    }),
                );
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

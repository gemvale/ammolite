import type { Format, Partial } from "ts-vista";

import type { CacheResult, Storage } from "#/cache/functions/storage";

import { createStorage } from "#/cache/functions/storage";

type CompleteReadCacheOptions = {
    cwd: string;
    file: string;
};

type ReadCacheOptions = Format<Partial<CompleteReadCacheOptions, "cwd">>;

const readCache = async (
    options: ReadCacheOptions,
): Promise<CacheResult | undefined> => {
    const storage: Storage = createStorage({
        cwd: options?.cwd,
    });

    return (await storage.get(options.file)) ?? void 0;
};

type CompleteReadCachesOptions = {
    cwd: string;
};

type ReadCachesOptions = Format<Partial<CompleteReadCachesOptions, "cwd">>;

type KeyValueCache = {
    key: string;
    value: CacheResult;
};

const readCaches = async (
    options: ReadCachesOptions,
): Promise<KeyValueCache[]> => {
    const storage: Storage = createStorage({
        cwd: options?.cwd,
    });

    const keys: string[] = await storage.getKeys();

    return await storage.getItems(keys);
};

export type { ReadCacheOptions, ReadCachesOptions, KeyValueCache };
export { readCache, readCaches };

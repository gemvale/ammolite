import type { Format, Partial } from "ts-vista";

import type { Storage } from "#/cache/functions/storage";

import { createStorage } from "#/cache/functions/storage";

type CompleteClearCacheOptions = {
    cwd: string;
    file: string;
};

type ClearCacheOptions = Format<Partial<CompleteClearCacheOptions, "cwd">>;

const clearCache = async (options: ClearCacheOptions): Promise<void> => {
    const storage: Storage = createStorage({
        cwd: options?.cwd,
    });

    try {
        await storage.removeItem(options.file);
    } catch (_: unknown) {
        // ignore rm errors
    }
};

type CompleteClearCachesOptions = {
    cwd: string;
};

type ClearCachesOptions = Format<Partial<CompleteClearCachesOptions>>;

const clearCaches = async (options: ClearCachesOptions): Promise<void> => {
    const storage: Storage = createStorage({
        cwd: options?.cwd,
    });

    try {
        await storage.clear();
    } catch (_: unknown) {
        // ignore rm errors
    }
};

export type { ClearCacheOptions, ClearCachesOptions };
export { clearCache, clearCaches };

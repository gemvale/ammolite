import type { Format, Partial } from "ts-vista";

import type { Storage } from "#/cache/functions/storage";

import { createStorage } from "#/cache/functions/storage";

type CompleteClearCacheOptions = {
    cwd: string;
};

type ClearCacheOptions = Format<Partial<CompleteClearCacheOptions>>;

const clearCache = async (options: ClearCacheOptions): Promise<void> => {
    const storage: Storage = createStorage({
        cwd: options?.cwd,
    });

    await storage.clear();
};

export type { ClearCacheOptions };
export { clearCache };

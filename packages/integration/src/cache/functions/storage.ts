import type { Format, Partial } from "ts-vista";
import type { Storage as UnStorage } from "unstorage";

import { createStorage as createUnstorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";

import { resolveCacheDir } from "#/cache/functions/dir";

type CompleteCreateStorageOptions = {
    cwd: string;
};

type CreateStorageOptions = Format<
    Partial<CompleteCreateStorageOptions, "cwd">
>;

type CacheResult = {
    css: string;
};

const createStorage = (
    options?: CreateStorageOptions,
): UnStorage<CacheResult> => {
    return createUnstorage<CacheResult>({
        driver: fsDriver({
            base: resolveCacheDir({
                cwd: options?.cwd,
            }),
        }),
    });
};

type Storage = ReturnType<typeof createStorage>;

export type { CreateStorageOptions, CacheResult, Storage };
export { createStorage };

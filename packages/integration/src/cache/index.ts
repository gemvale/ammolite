export type { ResolveCacheDirOptions } from "#/cache/functions/dir";
export type { CacheResult } from "#/cache/functions/storage";
export type {
    ClearCacheOptions,
    ClearCachesOptions,
} from "#/cache/operations/clear";
export type {
    KeyValueCache,
    ReadCacheOptions,
    ReadCachesOptions,
} from "#/cache/operations/read";
export type { WriteCacheOptions } from "#/cache/operations/write";

export { resolveCacheDir } from "#/cache/functions/dir";
export { clearCache, clearCaches } from "#/cache/operations/clear";
export { readCache, readCaches } from "#/cache/operations/read";
export { writeCache } from "#/cache/operations/write";

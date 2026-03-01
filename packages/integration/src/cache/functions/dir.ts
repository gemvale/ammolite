import type { Format, Partial } from "ts-vista";

import * as Path from "node:path";

type CompleteResolveCacheDirOptions = {
    cwd: string;
};

type ResolveCacheDirOptions = Format<Partial<CompleteResolveCacheDirOptions>>;

const resolveCacheDir = (options?: ResolveCacheDirOptions): string => {
    return Path.join(
        options?.cwd ?? process.cwd(),
        "node_modules",
        ".ammolite",
        "cache",
    );
};

type CompleteResolveCacheSignalFileOptions = {
    cwd: string;
};

type ResolveCacheSignalFileOptions = Format<
    Partial<CompleteResolveCacheSignalFileOptions>
>;

const resolveCacheSignalFile = (
    options?: ResolveCacheSignalFileOptions,
): string => {
    return Path.join(
        options?.cwd ?? process.cwd(),
        "node_modules",
        ".ammolite",
        "signal",
    );
};

export type { ResolveCacheDirOptions, ResolveCacheSignalFileOptions };
export { resolveCacheDir, resolveCacheSignalFile };

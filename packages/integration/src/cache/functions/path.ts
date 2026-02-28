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

export type { ResolveCacheDirOptions };
export { resolveCacheDir };

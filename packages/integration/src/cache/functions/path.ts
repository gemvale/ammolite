import type { Format, Partial } from "ts-vista";

import * as Path from "node:path";

type CompleteResolveCachePathOptions = {
    cwd: string;
};

type ResolveCachePathOptions = Format<Partial<CompleteResolveCachePathOptions>>;

const resolveCachePath = (options?: ResolveCachePathOptions): string => {
    return Path.join(
        options?.cwd ?? process.cwd(),
        "node_modules",
        ".ammolite",
        "cache",
    );
};

export type { ResolveCachePathOptions };
export { resolveCachePath };

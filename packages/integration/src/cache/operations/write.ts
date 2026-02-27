import type { Format, Partial } from "ts-vista";

import type { Storage } from "#/cache/functions/storage";

import { createStorage } from "#/cache/functions/storage";

type CompleteWriteCacheOptions = {
    cwd: string;
    file: string;
    css: string;
};

type WriteCacheOptions = Format<Partial<CompleteWriteCacheOptions, "cwd">>;

const writeCache = async (options: WriteCacheOptions): Promise<void> => {
    const storage: Storage = createStorage({
        cwd: options?.cwd,
    });

    await storage.set(options.file, {
        css: options.css,
    });
};

export type { WriteCacheOptions };
export { writeCache };

import type { Format, Partial } from "ts-vista";

import type { Storage } from "#/cache/functions/storage";

import * as Fs from "node:fs";
import * as Fsp from "node:fs/promises";
import * as Path from "node:path";

import { resolveCacheSignalFile } from "#/cache/functions/dir";
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

    const signalFile: string = resolveCacheSignalFile({
        cwd: options?.cwd,
    });

    const signalDir: string = Path.dirname(signalFile);

    if (!Fs.existsSync(signalDir)) {
        await Fsp.mkdir(signalDir, {
            recursive: true,
        });
    }

    await Fsp.writeFile(
        signalFile,
        process.hrtime.bigint().toString(),
        "utf-8",
    );
};

export type { WriteCacheOptions };
export { writeCache };

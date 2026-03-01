import type { Format, Partial } from "ts-vista";

import * as Path from "node:path";

type CompleteResolveLoggerDirOptions = {
    cwd: string;
};

type ResolveLoggerDirOptions = Format<Partial<CompleteResolveLoggerDirOptions>>;

const resolveLoggerDir = (options?: ResolveLoggerDirOptions): string => {
    return Path.join(
        options?.cwd ?? process.cwd(),
        "node_modules",
        ".ammolite",
        "logs",
    );
};

export type { ResolveLoggerDirOptions };
export { resolveLoggerDir };

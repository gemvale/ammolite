import type { LoadResult, Plugin } from "rolldown";

import * as Path from "node:path";

type EntryOverriderOptions = {
    file: string;
    code: string;
};

const entryOverrider = (options: EntryOverriderOptions): Plugin => {
    const normalizeTarget: string = Path.resolve(options.file);

    return {
        name: "@ammolite/transpiler/entry-overrider",
        load: (file: string): LoadResult => {
            const normalizeSource: string = Path.resolve(file);
            if (normalizeSource === normalizeTarget) return options.code;
            return void 0;
        },
    };
};

export type { EntryOverriderOptions };
export { entryOverrider };

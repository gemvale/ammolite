import type { Format, Partial } from "ts-vista";

import type { OutputOptions } from "#/@types/options";

import * as Path from "node:path";

const NAME_DEFAULT = "index" as const;

const EXT_DEFAULT = ".css" as const;

type CompleteGetOutputOptions = {
    output: OutputOptions;
};

type GetOutputOptions = Format<Partial<CompleteGetOutputOptions>>;

type Output = {
    /** Whether the output is the default (non-modified) */
    isDefault: boolean;
    /** Output directory, such as `static/css` */
    dir?: string;
    /** Output file name without extension, such as `index` */
    base: string;
    /** Output file extension, such as `.css` */
    ext: string;
    /** Output file name, such as `index.css` */
    name: string;
};

const getOutput = (options?: GetOutputOptions): Output => {
    const parsed: Path.ParsedPath = Path.parse(
        options?.output?.fileName ?? NAME_DEFAULT,
    );

    const base: string = parsed.name;
    const ext: string = parsed.ext || EXT_DEFAULT;
    const name: string = `${base}${ext}`;

    const dir: string | undefined = options?.output?.dir
        ? Path.join(options?.output?.dir)
        : void 0;

    return {
        isDefault: options?.output === void 0,
        dir,
        base,
        ext,
        name,
    };
};

export type { GetOutputOptions, Output };
export { getOutput };

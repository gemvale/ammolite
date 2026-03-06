import type { Format, Partial } from "ts-vista";

type CompletePluginOptions = {
    /**
     * Whether to emit the output file.
     *
     * By default, it is `true`.
     */
    emit: boolean;
    /**
     * Current working directory.
     *
     * By default, it is `process.cwd()`.
     */
    cwd: string;
};

type PluginOptions = Format<Partial<CompletePluginOptions>>;

export type { CompletePluginOptions, PluginOptions };

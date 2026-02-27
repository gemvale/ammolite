import type {
    InputOptions,
    OutputOptions as WebpackOutputOptions,
    PluginOptions as WebpackPluginOptions,
} from "@ammolite/unplugin/webpack";
import type { Format, Omit } from "ts-vista";

type OutputOptions = Format<Omit<WebpackOutputOptions, "dir">>;

type PluginOptions = Format<
    Omit<WebpackPluginOptions, "output"> & {
        /**
         * Output options.
         */
        output?: OutputOptions;
    }
>;

export type { InputOptions, OutputOptions, PluginOptions };

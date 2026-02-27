import type {
    InputOptions,
    OutputOptions,
    PluginOptions,
} from "#/@types/options";
import type { Plugin } from "#/bundlers/vite/create";

import { createPlugin } from "#/bundlers/vite/create";

const plugin: Plugin = createPlugin();

export type { InputOptions, OutputOptions, PluginOptions };
export { plugin as ammolite };

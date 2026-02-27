import type { InputOptions, OutputOptions } from "#/@types/options";
import type { Plugin, PluginOptions } from "#/bundlers/rollup/create";

import { createPlugin } from "#/bundlers/rollup/create";

const plugin: Plugin = createPlugin();

export type { InputOptions, OutputOptions, PluginOptions };
export { plugin as ammolite };

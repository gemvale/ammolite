import type { InputOptions, OutputOptions } from "#/@types/options";
import type { Plugin, PluginOptions } from "#/bundlers/rspack/create";

import { createPlugin } from "#/bundlers/rspack/create";

const plugin: Plugin = createPlugin();

export type { InputOptions, OutputOptions, PluginOptions };
export { plugin as AmmolitePlugin };

import type { InputOptions, OutputOptions } from "#/@types/options";
import type { Plugin, PluginOptions } from "#/bundlers/webpack/create";

import { createPlugin } from "#/bundlers/webpack/create";

const plugin: Plugin = createPlugin();

export type { InputOptions, OutputOptions, PluginOptions };
export { plugin as AmmolitePlugin };

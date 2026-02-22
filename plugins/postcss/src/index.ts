import type { InputOptions, PluginOptions } from "#/@types/options";
import type { Plugin } from "#/create";

import { createPlugin } from "#/create";

const plugin: Plugin = createPlugin();

export default plugin;
export type { InputOptions, PluginOptions };

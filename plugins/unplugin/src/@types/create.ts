import type { Runtime } from "@ammolite/integration/runtime";
import type { Format, Partial } from "ts-vista";

type CompleteCreatePluginOptions = {
    name: string;
    runtime: Runtime;
};

type CreatePluginOptions = Format<Partial<CompleteCreatePluginOptions>>;

export type { CompleteCreatePluginOptions, CreatePluginOptions };

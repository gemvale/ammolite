import type { Runtime } from "@ammolite/integration/runtime";
import type {
    NormalizedOutputOptions,
    OutputAsset,
    OutputBundle,
    PluginContext,
} from "rollup";
import type { Format, Partial } from "ts-vista";
import type { UnpluginOptions } from "unplugin";

import type { OutputOptions } from "#/@types/options";
import type { Output } from "#/functions/output";

import * as Path from "node:path";

import { getOutput } from "#/functions/output";
import { pickAsset } from "#/functions/rollup/pick";

type CompleteEmitPluginOptions = {
    name: string;
    version: string;
    emit: boolean;
    runtime: Runtime;
    cwd: string;
    output: OutputOptions;
};

type EmitPluginOptions = Format<
    Partial<CompleteEmitPluginOptions, "cwd" | "output">
>;

const emitPlugin = (options: EmitPluginOptions): UnpluginOptions[] => {
    const emit: boolean = options.emit;

    const runtime: Runtime = options.runtime;

    const output: Output = getOutput({
        output: options.output,
    });

    async function generateBundle(
        this: PluginContext,
        _options: NormalizedOutputOptions,
        bundle: OutputBundle,
        _isWrite: boolean,
    ): Promise<void> {
        if (!emit) return void 0;

        const result: string = await runtime.getAllCSS();

        if (output.isDefault) {
            const asset: OutputAsset | undefined = pickAsset({
                bundle,
                output,
            });

            if (asset) {
                const source: string =
                    typeof asset.source === "string"
                        ? asset.source
                        : Buffer.from(asset.source).toString("utf-8");

                asset.source = `${source}${result}`;

                return void 0;
            }
        }

        // output configured | no asset found

        this.emitFile({
            type: "asset",
            fileName: output.dir
                ? Path.join(output.dir ?? "", output.name)
                : output.name,
            source: result,
        });
    }

    return [
        {
            name: `${options.name}/emit`,
            rollup: {
                version: options.version,
                generateBundle,
            },
            rolldown: {
                version: options.version,
                // @ts-expect-error rollup version unmatched
                generateBundle,
            },
            vite: {
                version: options.version,
                // @ts-expect-error rollup version unmatched
                generateBundle,
            },
            farm: {
                version: options.version,
                generateBundle,
            },
        },
    ];
};

export type { EmitPluginOptions };
export { emitPlugin };

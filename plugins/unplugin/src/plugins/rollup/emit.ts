import type { Logger } from "@ammolite/integration/log";
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
    logger: Logger;
    name: string;
    emit: boolean;
    runtime: Runtime;
    output: OutputOptions;
};

type EmitPluginOptions = Format<Partial<CompleteEmitPluginOptions, "output">>;

const emitPlugin = ({
    name,
    emit,
    runtime,
    output: rawOutput,
}: EmitPluginOptions): UnpluginOptions[] => {
    const output: Output = getOutput({
        output: rawOutput,
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
            name: `${name}/emit`,
            rollup: {
                generateBundle,
            },
            rolldown: {
                // @ts-expect-error rollup version unmatched
                generateBundle,
            },
            vite: {
                // @ts-expect-error rollup version unmatched
                generateBundle,
            },
            farm: {
                generateBundle,
            },
        },
    ];
};

export type { EmitPluginOptions };
export { emitPlugin };

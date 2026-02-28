import type { Runtime } from "@ammolite/integration/runtime";
import type { Format, Partial } from "ts-vista";
import type { UnpluginOptions } from "unplugin";
import type { Asset, Compilation, Compiler, PathData } from "webpack";

import type { OutputOptions } from "#/@types/options";
import type { Output } from "#/functions/output";
import type { GetHashContent } from "#/functions/webpack/hash";

import * as Path from "node:path";

import { getOutput } from "#/functions/output";
import { createGetHashContent } from "#/functions/webpack/hash";
import { pickAsset } from "#/functions/webpack/pick";

type CompleteEmitPluginOptions = {
    name: string;
    emit: boolean;
    runtime: Runtime;
    cwd: string;
    output: OutputOptions;
};

type EmitPluginOptions = Format<
    Partial<CompleteEmitPluginOptions, "cwd" | "output">
>;

const emitPlugin = (options: EmitPluginOptions): UnpluginOptions[] => {
    const name = `${options.name}/emit` as const;

    const emit: boolean = options.emit;

    const runtime: Runtime = options.runtime;

    const output: Output = getOutput({
        output: options.output,
    });

    const emitAsset = (compiler: Compiler): void => {
        const { Compilation, WebpackError } = compiler.webpack;
        const { RawSource } = compiler.webpack.sources;

        compiler.hooks.make.tap(name, (compilation: Compilation): void => {
            const getHashContent: GetHashContent = createGetHashContent({
                compiler,
                compilation,
            });

            compilation.hooks.processAssets.tapPromise(
                {
                    name,
                    stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
                },
                async (): Promise<void> => {
                    try {
                        // no emit
                        if (!emit) return void 0;

                        const css: string = await runtime.getAllCSS();

                        const contentHash: string = getHashContent(css);

                        const out: string = output.dir
                            ? Path.join(output.dir, output.name)
                            : output.name;

                        const data: PathData = {
                            filename: out,
                            contentHash,
                            chunk: {
                                id: out,
                                name: output.name,
                                hash: contentHash,
                            },
                        };

                        const { path: assetPath, info: assetInfo } =
                            compilation.getPathWithInfo(out, data);

                        const assets: Readonly<Asset>[] =
                            compilation.getAssets();

                        const asset: Asset | undefined = pickAsset({
                            assets,
                            output,
                        });

                        if (asset) {
                            const previous: string = asset.source
                                .source()
                                .toString();

                            const nextSource: string = `${previous}${css}`;

                            compilation.updateAsset(
                                assetPath,
                                new RawSource(nextSource),
                            );

                            return void 0;
                        }

                        compilation.emitAsset(
                            assetPath,
                            new RawSource(css),
                            assetInfo,
                        );
                    } catch (er: unknown) {
                        if (er instanceof WebpackError) {
                            compilation.errors.push(er);
                        } else {
                            compilation.errors.push(
                                new WebpackError(String(er)),
                            );
                        }
                    }
                },
            );
        });
    };

    return [
        {
            name,
            webpack(compiler: Compiler) {
                emitAsset(compiler);
            },
            // @ts-expect-error compiler type unmatched
            rspack(compiler: Compiler) {
                emitAsset(compiler);
            },
        },
    ];
};

export type { EmitPluginOptions };
export { emitPlugin };

import type { Logger } from "@ammolite/integration/log";
import type { Runtime } from "@ammolite/integration/runtime";
import type { Format, Partial } from "ts-vista";
import type { UnpluginOptions } from "unplugin";
import type { Asset, Compilation, Compiler } from "webpack";

import type { OutputOptions } from "#/@types/options";
import type { Output } from "#/functions/output";
import type { GetHashContent } from "#/functions/webpack/hash";
import type { HtmlCompilationHooks } from "#/plugins/webpack/html/hook";

import { getOutput } from "#/functions/output";
import { createGetHashContent } from "#/functions/webpack/hash";
import { pickAsset } from "#/functions/webpack/pick";
import { getHtmlHooks } from "#/plugins/webpack/html/hook";

type CompleteHtmlPluginOptions = {
    logger: Logger;
    name: string;
    emit: boolean;
    runtime: Runtime;
    output: OutputOptions;
};

type HtmlPluginOptions = Format<Partial<CompleteHtmlPluginOptions, "output">>;

const htmlPlugin = ({
    name: rawName,
    emit,
    runtime,
    output: rawOutput,
}: HtmlPluginOptions): UnpluginOptions[] => {
    const name = `${rawName}/html` as const;

    const output: Output = getOutput({
        output: rawOutput,
    });

    const injectHtml = (compiler: Compiler): void => {
        const { Compilation, WebpackError } = compiler.webpack;

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

                        const assets: Readonly<Asset>[] =
                            compilation.getAssets();

                        const asset = pickAsset({
                            assets,
                            output,
                        });

                        if (!asset) return void 0;

                        const htmlHooks: HtmlCompilationHooks[] = getHtmlHooks({
                            compilation,
                            compiler,
                        });

                        for (const hooks of htmlHooks) {
                            hooks.beforeEmit?.tapPromise(
                                name,
                                async ({ html, outputName, plugin }) => {
                                    const href: string = (plugin as any)
                                        ?.options?.hash
                                        ? `/${asset.name}?${contentHash}`
                                        : `/${asset.name}`;

                                    return {
                                        html: html.replace(
                                            "</head>",
                                            `<link rel="stylesheet" href="${href}" /></head>`,
                                        ),
                                        outputName,
                                        plugin,
                                    };
                                },
                            );
                        }
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
                injectHtml(compiler);
            },
            // @ts-expect-error compiler type unmatched
            rspack(compiler: Compiler) {
                injectHtml(compiler);
            },
        },
    ];
};

export type { HtmlPluginOptions };
export { htmlPlugin };

import type { OutputAsset, OutputBundle } from "rollup";
import type { Format, Partial } from "ts-vista";
import type { UnpluginOptions } from "unplugin";
import type {
    IndexHtmlTransformContext,
    IndexHtmlTransformResult,
    MinimalPluginContextWithoutEnvironment,
} from "vite";

import type { OutputOptions } from "#/@types/options";
import type { Output } from "#/functions/output";

import { getOutput } from "#/functions/output";
import { pickAsset } from "#/functions/rollup/pick";

type CompleteHtmlPluginOptions = {
    name: string;
    version: string;
    emit: boolean;
    cwd: string;
    output: OutputOptions;
};

type HtmlPluginOptions = Format<
    Partial<CompleteHtmlPluginOptions, "cwd" | "output">
>;

const htmlPlugin = (options: HtmlPluginOptions): UnpluginOptions[] => {
    const version: string = options.version;

    const emit: boolean = options.emit;

    const output: Output = getOutput({
        output: options.output,
    });

    function transformIndexHtml(
        this: MinimalPluginContextWithoutEnvironment,
        html: string,
        ctx: IndexHtmlTransformContext,
    ): IndexHtmlTransformResult | undefined {
        const bundle: OutputBundle | undefined = ctx.bundle;

        // no emit | no bundle
        if (!emit || !bundle) return html;

        // get output CSS filename
        const asset: OutputAsset | undefined = pickAsset({
            bundle,
            output,
        });

        if (!asset) return html;

        if (html.includes(asset.fileName)) return html;

        return {
            html,
            tags: [
                {
                    tag: "link",
                    attrs: {
                        ref: "stylesheet",
                        crossorigin: true,
                        href: `/${asset.fileName}`,
                    },
                    injectTo: "head",
                },
            ],
        };
    }

    return [
        {
            name: `${options.name}/html`,
            vite: {
                version,
                transformIndexHtml,
            },
            farm: {
                version,
                transformIndexHtml,
            },
        },
    ];
};

export type { HtmlPluginOptions };
export { htmlPlugin };

import type { Logger } from "@ammolite/integration/log";
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
    logger: Logger;
    name: string;
    emit: boolean;
    output: OutputOptions;
};

type HtmlPluginOptions = Format<Partial<CompleteHtmlPluginOptions, "output">>;

const htmlPlugin = ({
    name,
    emit,
    output: rawOutput,
}: HtmlPluginOptions): UnpluginOptions[] => {
    const output: Output = getOutput({
        output: rawOutput,
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
            name: `${name}/html`,
            vite: {
                transformIndexHtml,
            },
            farm: {
                transformIndexHtml,
            },
        },
    ];
};

export type { HtmlPluginOptions };
export { htmlPlugin };

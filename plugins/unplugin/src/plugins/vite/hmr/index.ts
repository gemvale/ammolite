import type { Logger } from "@ammolite/integration/log";
import type { Runtime } from "@ammolite/integration/runtime";
import type { InputOption } from "rollup";
import type { UnpluginOptions } from "unplugin";
import type {
    Plugin,
    ResolvedConfig,
    TransformResult,
    ViteDevServer,
} from "vite";

import * as Fsp from "node:fs/promises";
import * as Path from "node:path";

import { FILTER_JS_ADVANCED } from "@ammolite/integration/filter";

const PREFIX = "ammolite" as const;

type HmrPluginOptions = {
    logger: Logger;
    name: string;
    emit: boolean;
    runtime: Runtime;
};

const hmrPlugin = ({
    name,
    emit,
    runtime,
}: HmrPluginOptions): UnpluginOptions[] => {
    const entries: string[] = [];

    let server: ViteDevServer | null = null;

    let isServerReady: boolean = false;

    // resolve entry

    function resolveEntryConfigResolved(config: ResolvedConfig): void {
        const input: InputOption | undefined =
            config.build.rollupOptions?.input;

        if (typeof input === "string") {
            entries.push(input);
        } else if (Array.isArray(input)) {
            entries.push(...input);
        }
    }

    const resolveEntryTransform: Plugin["transform"] = {
        filter: {
            id: {
                include: [
                    FILTER_JS_ADVANCED,
                ],
                exclude: [
                    /vite\/dist\/client\/client\./,
                    /vite\/dist\/client\/env\./,
                ],
            },
        },
        handler(_code: string, id: string): void {
            if (entries.length === 0) entries.push(id);
        },
    };

    // inject HMR

    const injectHmrTransform: Plugin["transform"] = {
        filter: {
            id: {
                include: [
                    FILTER_JS_ADVANCED,
                ],
            },
        },
        async handler(
            code: string,
            id: string,
        ): Promise<TransformResult | undefined> {
            if (!entries.includes(id)) return void 0;

            // should only inject script into client side,
            // so it will trigger HMR on client reload
            const ssr: string | boolean = this.environment.config.build.ssr;
            const isSSR: boolean = typeof ssr === "string" ? true : ssr;

            if (isSSR) return void 0;

            const script: string = await Fsp.readFile(
                Path.resolve(import.meta.dirname, "hmr.mjs"),
                "utf-8",
            );

            return {
                code: `${script}\n${code}`,
                map: null,
            };
        },
    };

    // emit HMR

    function emitHmrConfigureServer(devServer: ViteDevServer): void {
        if (!emit) return void 0;

        server = devServer;

        devServer.httpServer?.once("listening", (): void => {
            isServerReady = true;
        });

        devServer.ws.on(`${PREFIX}:init`, async (): Promise<void> => {
            const data: string = await runtime.getAllCSS();

            devServer.ws.send({
                type: "custom",
                event: `${PREFIX}:style`,
                data,
            });
        });
    }

    const emitHmrTransform: Plugin["transform"] = {
        order: "post",
        filter: {
            id: {
                include: [
                    FILTER_JS_ADVANCED,
                ],
            },
        },
        async handler(): Promise<void> {
            if (!emit || !server || !isServerReady) return void 0;

            const data: string = await runtime.getAllCSS();

            server.ws.send({
                type: "custom",
                event: `${PREFIX}:style`,
                data,
            });
        },
    };

    return [
        // resolve entry
        {
            name: `${name}/hmr/resolve-entry`,
            vite: {
                // biome-ignore lint/suspicious/noTsIgnore: vite version unmatched
                // @ts-ignore vite version unmatched
                configResolved: resolveEntryConfigResolved,
                transform: resolveEntryTransform,
            },
            farm: {
                configResolved: resolveEntryConfigResolved,
                transform: resolveEntryTransform,
            },
        },
        // inject HMR
        {
            name: `${name}/hmr/inject`,
            vite: {
                transform: injectHmrTransform,
            },
            farm: {
                transform: injectHmrTransform,
            },
        },
        // emit HMR
        {
            name: `${name}/hmr/emit`,
            vite: {
                // biome-ignore lint/suspicious/noTsIgnore: vite version unmatched
                // @ts-ignore vite version unmatched
                configureServer: emitHmrConfigureServer,
                transform: emitHmrTransform,
            },
            farm: {
                configureServer: emitHmrConfigureServer,
                transform: emitHmrTransform,
            },
        },
    ];
};

export type { HmrPluginOptions };
export { hmrPlugin };

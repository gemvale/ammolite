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
    name: string;
    version: string;
    emit: boolean;
    runtime: Runtime;
};

const hmrPlugin = (options: HmrPluginOptions): UnpluginOptions[] => {
    const version: string = options.version;

    const emit: boolean = options.emit;

    const runtime: Runtime = options.runtime;

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
            name: `${options.name}/hmr/resolve-entry`,
            vite: {
                version,
                configResolved: resolveEntryConfigResolved,
                transform: resolveEntryTransform,
            },
            farm: {
                version,
                configResolved: resolveEntryConfigResolved,
                transform: resolveEntryTransform,
            },
        },
        // inject HMR
        {
            name: `${options.name}/hmr/inject`,
            vite: {
                version,
                transform: injectHmrTransform,
            },
            farm: {
                version,
                transform: injectHmrTransform,
            },
        },
        // emit HMR
        {
            name: `${options.name}/hmr/emit`,
            vite: {
                version,
                configureServer: emitHmrConfigureServer,
                transform: emitHmrTransform,
            },
            farm: {
                version,
                configureServer: emitHmrConfigureServer,
                transform: emitHmrTransform,
            },
        },
    ];
};

export type { HmrPluginOptions };
export { hmrPlugin };

import type { Logger } from "@ammolite/integration/log";
import type { CompileResult, Runtime } from "@ammolite/integration/runtime";
import type { TransformResult, UnpluginOptions } from "unplugin";

import { FILTER_JS_ADVANCED } from "@ammolite/integration/filter";

type CompilePluginOptions = {
    logger: Logger;
    name: string;
    runtime: Runtime;
};

const compilePlugin = ({
    name,
    runtime,
}: CompilePluginOptions): UnpluginOptions[] => {
    return [
        {
            name: `${name}/compile`,
            transform: {
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
                    const file: string = id;

                    const result: CompileResult | undefined =
                        await runtime.compile({
                            file,
                            code,
                        });

                    if (!result) return void 0;

                    return {
                        code: result.code,
                        map: {
                            ...result.map,
                            file,
                        },
                    };
                },
            },
        },
    ];
};

export type { CompilePluginOptions };
export { compilePlugin };

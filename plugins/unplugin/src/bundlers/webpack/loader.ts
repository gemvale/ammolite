import type {
    CompileResult,
    CreateRuntimeOptions,
    Runtime,
} from "@ammolite/integration/runtime";
import type { Format, Partial } from "ts-vista";
import type { LoaderContext } from "webpack";

import { writeCache } from "@ammolite/integration/cache";
import { createRuntime } from "@ammolite/integration/runtime";

let runtime: Runtime | null = null;

/**
 * Options for the loader.
 */
type LoaderOptions = Format<
    Partial<
        Pick<CreateRuntimeOptions, "cwd" | "include" | "exclude" | "tsconfig">
    >
>;

/**
 * Webpack loader function.
 */
async function loader(
    this: LoaderContext<LoaderOptions>,
    source: string,
): Promise<void> {
    this.cacheable(true);

    const options: LoaderOptions = this.getOptions();

    const callback: ReturnType<LoaderContext<LoaderOptions>["async"]> =
        this.async();

    if (!runtime) {
        runtime = createRuntime({
            cwd: options.cwd,
            include: options.include,
            exclude: options.exclude,
            tsconfig: options.tsconfig,
        });
    }

    try {
        const result: CompileResult | undefined = await runtime.compile({
            file: this.resourcePath,
            code: source,
        });

        if (!result) return callback(void 0, source);

        await writeCache({
            cwd: options.cwd,
            file: this.resourcePath,
            css: result.css,
        });

        return callback(void 0, result.code, {
            ...result.map,
            file: this.resourcePath,
        });
    } catch (err: unknown) {
        if (err instanceof Error) return callback(err);
        return callback(new Error(String(err)));
    }
}

export default loader;

export type { LoaderOptions };

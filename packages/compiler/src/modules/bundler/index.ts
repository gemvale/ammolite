import type {
    OutputChunk,
    RolldownBuild,
    RolldownOutput,
    SourceMap,
} from "rolldown";
import type { Format } from "ts-vista";

import type { CompilerContext } from "#/contexts/compiler";

import * as Path from "node:path";

import { rolldown } from "rolldown";
import tsConfigPaths from "rollup-plugin-tsconfig-paths";

import { entryOverrider } from "#/modules/bundler/plugins/entry";
import { externalResolver } from "#/modules/bundler/plugins/external";
import { filePreprocessor } from "#/modules/bundler/plugins/preprocess";

/**
 * Preset options for `bundle` function.
 */
type PresetBundleOptions = {
    /**
     * Compiler context.
     */
    context: CompilerContext;
    /**
     * Name of the CSS-in-JS package.
     */
    packageName: string;
    /**
     * List of functions to be preprocessed.
     */
    includedFunctions: readonly string[];
};

/**
 * User defined options for `bundle` function.
 */
type UserBundleOptions = {
    /**
     * Current working directory.
     */
    cwd: string;
    /**
     * Array of packages/paths to include.
     *
     * Packages/paths in `include` option will be
     * overwritten by `exclude` option.
     */
    include: readonly string[];
    /**
     * Array of packages/paths to exclude.
     */
    exclude: readonly string[];
    /**
     * Dedicated tsconfig file to be used.
     */
    tsconfig?: string;
};

/**
 * Dynamic options for `bundle` function to bundle file.
 */
type DynamicBundleOptions = {
    /**
     * File to be bundled.
     */
    file: string;
    /**
     * preprocessed entry code.
     */
    code: string;
};

/**
 * Options for `bundle` function.
 */
type BundleOptions = Format<
    PresetBundleOptions & UserBundleOptions & DynamicBundleOptions
>;

/**
 * Result of `bundle` function.
 */
type BundleResult = {
    /**
     * Bundled code.
     */
    code: string;
    /**
     * Source map.
     */
    map: SourceMap | undefined;
};

type ResolveTsconfigPathOptions = {
    cwd: string;
    tsconfig?: string;
};

const resolveTsconfigPath = (
    options: ResolveTsconfigPathOptions,
): string | undefined => {
    if (!options.tsconfig) return void 0;

    if (Path.isAbsolute(options.tsconfig)) {
        return options.tsconfig;
    }

    return Path.resolve(options.cwd, options.tsconfig);
};

/**
 * Bundle function to bundle entry file for reference.
 */
const bundle = async (options: BundleOptions): Promise<BundleResult> => {
    const bundlerName: string = options.context.bundler.name;

    const tsconfigPath: string | undefined = resolveTsconfigPath({
        cwd: options.cwd,
        tsconfig: options.tsconfig,
    });

    const bundled: RolldownBuild = await rolldown({
        input: options.file,
        cwd: options.cwd,
        logLevel: "silent",
        transform: {
            jsx: "preserve",
        },
        treeshake: false,
        tsconfig: tsconfigPath,
        plugins: [
            ...(bundlerName === "webpack" || bundlerName === "rspack"
                ? [
                      tsConfigPaths({
                          tsConfigPath: tsconfigPath,
                      }),
                  ]
                : []),
            externalResolver({
                packageName: options.packageName,
                file: options.file,
                include: options.include,
                exclude: options.exclude,
            }),
            entryOverrider({
                file: options.file,
                code: options.code,
            }),
            filePreprocessor({
                context: options.context,
                packageName: options.packageName,
                file: options.file,
                includedFunctions: options.includedFunctions,
            }),
        ],
        experimental: {
            attachDebugInfo: "none",
        },
    });

    const result: RolldownOutput = await bundled.generate({
        minify: false,
    });

    const output: OutputChunk = result.output[0];

    return {
        code: output.code,
        map: output.map ?? void 0,
    };
};

export type {
    BundleOptions,
    BundleResult,
    DynamicBundleOptions,
    PresetBundleOptions,
    UserBundleOptions,
};
export { bundle };

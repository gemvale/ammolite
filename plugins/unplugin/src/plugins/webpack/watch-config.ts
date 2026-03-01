import type { Logger } from "@ammolite/integration/log";
import type { Format } from "ts-vista";
import type { UnpluginOptions } from "unplugin";
import type { Compiler } from "webpack";

const SNAPSHOT_MANAGED_PATHS_NODE_MODULES: RegExp =
    /^(.+?[\\/]node_modules[\\/](?!\.ammolite(?:[\\/]|$)))/;

type CompleteWatchPluginOptions = {
    logger: Logger;
    name: string;
};

type WatchConfigPluginOptions = Format<CompleteWatchPluginOptions>;

type PathPattern = string | RegExp;

const isNodeModulesPattern = (pattern: PathPattern): boolean => {
    if (typeof pattern === "string") return pattern.includes("node_modules");

    return pattern.source.includes("node_modules");
};

const isPatternMatched = (
    patterns: readonly PathPattern[],
    target: PathPattern,
): boolean => {
    return patterns.some((pattern: PathPattern): boolean => {
        if (typeof pattern === "string" && typeof target === "string") {
            return pattern === target;
        }

        if (pattern instanceof RegExp && target instanceof RegExp) {
            return (
                pattern.source === target.source &&
                pattern.flags === target.flags
            );
        }

        return false;
    });
};

const resolveManagedPaths = (raw?: readonly PathPattern[]): PathPattern[] => {
    const patterns: PathPattern[] = (raw ?? []).filter(
        (pattern): boolean => !isNodeModulesPattern(pattern),
    );

    if (isPatternMatched(patterns, SNAPSHOT_MANAGED_PATHS_NODE_MODULES)) {
        return patterns;
    }

    return [
        ...patterns,
        SNAPSHOT_MANAGED_PATHS_NODE_MODULES,
    ];
};

const watchConfigPlugin = ({
    name,
}: WatchConfigPluginOptions): UnpluginOptions[] => {
    const setWatchConfig = (compiler: Compiler): void => {
        compiler.hooks.afterEnvironment.tap(name, (): void => {
            const snapshot: NonNullable<Compiler["options"]["snapshot"]> =
                compiler.options.snapshot ?? {};

            compiler.options.snapshot = {
                ...snapshot,
                managedPaths: resolveManagedPaths(snapshot.managedPaths),
            };
        });
    };

    return [
        {
            name: `${name}/watch-config`,
            webpack(compiler: Compiler): void {
                setWatchConfig(compiler);
            },
            // @ts-expect-error compiler type unmatched
            rspack(compiler: Compiler): void {
                setWatchConfig(compiler);
            },
        },
    ];
};

export type { WatchConfigPluginOptions };
export { watchConfigPlugin };

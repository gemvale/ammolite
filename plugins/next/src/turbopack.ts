import type { LoaderOptions } from "@ammolite/unplugin/webpack/loader";
import type { NextConfig } from "next";
import type {
    TurbopackLoaderItem,
    TurbopackOptions,
    TurbopackRuleConfigCollection,
    TurbopackRuleConfigItem,
} from "next/dist/server/config-shared";

type PluginOptions = LoaderOptions;

const RULE_KEY = "*.{js,jsx,ts,tsx}" as const;

const appendLoader = (
    rule: TurbopackRuleConfigCollection | undefined,
    loader: TurbopackLoaderItem,
): TurbopackRuleConfigCollection => {
    if (Array.isArray(rule)) {
        return [
            ...rule,
            loader,
        ];
    }

    const baseRule: TurbopackRuleConfigItem = rule ?? {
        loaders: [],
    };

    return {
        ...baseRule,
        loaders: [
            ...baseRule.loaders,
            loader,
        ],
    };
};

const plugin = (
    options?: PluginOptions,
): ((nextConfig?: NextConfig) => NextConfig) => {
    return (nextConfig?: NextConfig): NextConfig => {
        const base: NextConfig = nextConfig ?? {};

        const turbopack: TurbopackOptions = base.turbopack ?? {};

        const rules: TurbopackOptions["rules"] = turbopack.rules ?? {};

        const rule: TurbopackRuleConfigCollection | undefined = rules[RULE_KEY];

        const loader: TurbopackLoaderItem = {
            loader: "@ammolite/unplugin/webpack/loader",
            options: {
                cwd: options?.cwd ?? process.cwd(),
                include: [
                    ...(options?.include ?? []),
                ],
                exclude: [
                    ...(options?.exclude ?? []),
                ],
            },
        };

        return {
            ...base,
            turbopack: {
                ...turbopack,
                rules: {
                    ...rules,
                    [RULE_KEY]: appendLoader(rule, loader),
                },
            },
        } satisfies NextConfig;
    };
};

export type { PluginOptions };
export { plugin as ammolite };

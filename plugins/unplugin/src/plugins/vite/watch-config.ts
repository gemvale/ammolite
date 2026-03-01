import type { Logger } from "@ammolite/integration/log";
import type { Format } from "ts-vista";
import type { UnpluginOptions } from "unplugin";
import type { UserConfig } from "vite";

const WATCH_IGNORED_PATTERN = "!**/node_modules/.ammolite/**" as const;

type CompleteWatchPluginOptions = {
    logger: Logger;
    name: string;
};

type WatchConfigPluginOptions = Format<CompleteWatchPluginOptions>;

const watchConfigPlugin = ({
    name,
}: WatchConfigPluginOptions): UnpluginOptions[] => {
    const config = (): UserConfig => ({
        server: {
            watch: {
                ignored: [
                    WATCH_IGNORED_PATTERN,
                ],
            },
        },
    });

    return [
        {
            name: `${name}/watch-config`,
            vite: {
                config,
            },
            farm: {
                config,
            },
        },
    ];
};

export type { WatchConfigPluginOptions };
export { watchConfigPlugin };

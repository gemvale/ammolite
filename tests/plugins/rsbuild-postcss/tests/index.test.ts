import type { CreatedPaths } from "@ammolite/test-core";
import type { PostCSSLoaderOptions } from "@rsbuild/core";

import * as Path from "node:path";

import ammolitePostCSS from "@ammolite/postcss";
import { pluginAmmolite } from "@ammolite/rsbuild";
import {
    assertBuiltCss,
    assertBuiltJs,
    cleanupPluginArtifacts,
    createPaths,
} from "@ammolite/test-core";
import { createRsbuild } from "@rsbuild/core";
import { beforeAll, describe, it } from "vitest";

const CWD: string = process.cwd();

const TEST_PATHS: CreatedPaths = createPaths(CWD);

const PATH_DIST: string = TEST_PATHS.dist;

const PATH_JS: string = Path.join(PATH_DIST, "static/js/index.js");

const PATH_CSS: string = Path.join(PATH_DIST, "static/css/index.css");

beforeAll(async (): Promise<void> => {
    await cleanupPluginArtifacts(TEST_PATHS);
});

const buildRsbuild = async (): Promise<void> => {
    const rsbuild = await createRsbuild({
        cwd: CWD,
        rsbuildConfig: {
            source: {
                entry: {
                    index: "./src/index.ts",
                },
            },
            output: {
                filenameHash: false,
                minify: false,
                sourceMap: false,
                distPath: {
                    root: "dist",
                },
            },
            plugins: [
                pluginAmmolite({
                    emit: false,
                }),
            ],
            tools: {
                rspack: {
                    cache: false,
                },
                postcss: (_: PostCSSLoaderOptions, { addPlugins }): void => {
                    addPlugins(ammolitePostCSS);
                },
            },
            logLevel: "warn",
        },
    });

    const result = await rsbuild.build();

    await result.close();
};

describe("rsbuild test", (): void => {
    it("should build via Rsbuild + PostCSS", async (): Promise<void> => {
        await buildRsbuild();
    });

    it("should build JS file correctly", async (): Promise<void> => {
        await assertBuiltJs(PATH_JS, "var-compatible");
    });

    it("should build CSS file correctly", async (): Promise<void> => {
        await assertBuiltCss(PATH_CSS);
    });
});

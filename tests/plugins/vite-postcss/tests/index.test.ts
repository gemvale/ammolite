import type { CreatedPaths } from "@ammolite/test-core";

import * as Path from "node:path";

import ammolitePostCSS from "@ammolite/postcss";
import {
    assertBuiltCss,
    assertBuiltJs,
    cleanupPluginArtifacts,
    createPaths,
} from "@ammolite/test-core";
import { ammolite } from "@ammolite/unplugin/vite";
import { build } from "vite";
import { beforeAll, describe, it } from "vitest";

const CWD: string = process.cwd();

const TEST_PATHS: CreatedPaths = createPaths(CWD);

const PATH_DIST: string = TEST_PATHS.dist;

const PATH_ASSETS: string = Path.join(PATH_DIST, "assets");

beforeAll(async (): Promise<void> => {
    await cleanupPluginArtifacts(TEST_PATHS);
});

describe("vite test", (): void => {
    it("should build via Vite + PostCSS", async (): Promise<void> => {
        await build({
            root: CWD,
            build: {
                outDir: "dist",
                minify: false,
                sourcemap: false,
                rollupOptions: {
                    output: {
                        entryFileNames: "assets/[name].js",
                        chunkFileNames: "assets/[name].js",
                        assetFileNames: "assets/[name][extname]",
                    },
                },
            },
            plugins: [
                ammolite({
                    emit: false,
                }),
            ],
            css: {
                postcss: {
                    plugins: [
                        // @ts-expect-error PostCSS version unmatched
                        ammolitePostCSS(),
                    ],
                },
            },
            logLevel: "warn",
        });
    });

    it("should build JS file correctly", async (): Promise<void> => {
        const pathFile: string = Path.join(PATH_ASSETS, "index.js");

        await assertBuiltJs(pathFile, "const-only");
    });

    it("should build CSS file correctly", async (): Promise<void> => {
        const pathFile: string = Path.join(PATH_ASSETS, "index.css");

        await assertBuiltCss(pathFile);
    });
});

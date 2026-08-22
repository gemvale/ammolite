import type { CreatedPaths } from "@ammolite/test-core";

import * as Fsp from "node:fs/promises";
import * as Path from "node:path";

import {
    assertBuiltCss,
    assertBuiltJs,
    cleanupPluginArtifacts,
    createPaths,
    findBuiltFile,
} from "@ammolite/test-core";
import { ammolite } from "@ammolite/unplugin/vite";
import { build } from "vite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const CWD: string = process.cwd();

const TEST_PATHS: CreatedPaths = createPaths(CWD);

const PATH_DIST: string = TEST_PATHS.dist;

const PATH_ASSETS: string = Path.join(PATH_DIST, "assets");

const PATH_SRC: string = Path.join(CWD, "src");

const PATH_INDEX_TS: string = Path.join(PATH_SRC, "index.ts");

const PATH_DIST_A: string = Path.join(CWD, "dist-a");

const PATH_DIST_B: string = Path.join(CWD, "dist-b");

const INDEX_TS_EXTRA: string = `
import { style } from "ammolite";

import "./index.css";

import { fadeIn, spin } from "./keyframes";
import { container } from "./style";
import { colors } from "./variables";

const extra: string = style({
    color: "red",
});

console.log({
    colors,
    container,
    extra,
    fadeIn,
    spin,
});
`;

beforeAll(async (): Promise<void> => {
    await cleanupPluginArtifacts(TEST_PATHS);
});

describe("vite test", (): void => {
    it("should build via Vite", async (): Promise<void> => {
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
                ammolite(),
            ],
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

describe("vite content-hash test", (): void => {
    afterAll(async (): Promise<void> => {
        await Fsp.rm(PATH_DIST_A, {
            recursive: true,
            force: true,
        });
        await Fsp.rm(PATH_DIST_B, {
            recursive: true,
            force: true,
        });
    });

    it("should produce different hashed CSS filenames", async (): Promise<void> => {
        const indexSource: string = await Fsp.readFile(PATH_INDEX_TS, "utf-8");

        try {
            await build({
                root: CWD,
                build: {
                    outDir: "dist-a",
                    minify: false,
                    sourcemap: false,
                    rollupOptions: {
                        output: {
                            entryFileNames: "assets/[name].js",
                            chunkFileNames: "assets/[name].js",
                            assetFileNames: "assets/[name]-[hash][extname]",
                        },
                    },
                },
                plugins: [
                    ammolite(),
                ],
                logLevel: "warn",
            });

            await Fsp.writeFile(PATH_INDEX_TS, INDEX_TS_EXTRA, "utf-8");

            await build({
                root: CWD,
                build: {
                    outDir: "dist-b",
                    minify: false,
                    sourcemap: false,
                    rollupOptions: {
                        output: {
                            entryFileNames: "assets/[name].js",
                            chunkFileNames: "assets/[name].js",
                            assetFileNames: "assets/[name]-[hash][extname]",
                        },
                    },
                },
                plugins: [
                    ammolite(),
                ],
                logLevel: "warn",
            });

            const cssA: string = await findBuiltFile(PATH_DIST_A, /\.css$/);
            const cssB: string = await findBuiltFile(PATH_DIST_B, /\.css$/);

            const nameA: string = Path.basename(cssA);
            const nameB: string = Path.basename(cssB);

            expect(nameA).not.toBe(nameB);
        } finally {
            await Fsp.writeFile(PATH_INDEX_TS, indexSource, "utf-8");
        }
    });
});

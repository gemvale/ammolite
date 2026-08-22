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
import { AmmolitePlugin } from "@ammolite/unplugin/webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import webpack from "webpack";

const CWD: string = process.cwd();

const TEST_PATHS: CreatedPaths = createPaths(CWD);

const PATH_DIST: string = TEST_PATHS.dist;

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

type BuildWebpackOptions = {
    outDir: string;
    cssFilename: string;
};

const buildWebpack = async (options: BuildWebpackOptions): Promise<void> => {
    const { outDir, cssFilename }: BuildWebpackOptions = options;
    const swcOptions: {
        jsc: {
            parser: {
                syntax: "typescript";
            };
            target: "es2022";
        };
    } = {
        jsc: {
            parser: {
                syntax: "typescript",
            },
            target: "es2022",
        },
    };

    const config: webpack.Configuration = {
        mode: "production",
        context: CWD,
        entry: "./src/index.ts",
        devtool: false,
        resolve: {
            extensions: [
                ".ts",
                ".js",
            ],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/i,
                    exclude: /node_modules/,
                    use: {
                        loader: "swc-loader",
                        options: swcOptions,
                    },
                },
                {
                    test: /\.css$/i,
                    exclude: /node_modules/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                    ],
                },
            ],
        },
        output: {
            path: outDir,
            filename: "index.js",
        },
        optimization: {
            minimize: false,
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: cssFilename,
            }),
            new AmmolitePlugin(),
        ],
    };

    await new Promise<void>((resolve, reject): void => {
        const compiler: webpack.Compiler = webpack(config);

        compiler.run((error?: Error | null, stats?: webpack.Stats): void => {
            void compiler.close((closeError?: Error | null): void => {
                if (error || closeError) {
                    reject(error ?? closeError);

                    return;
                }

                if (stats?.hasErrors()) {
                    const message: string = stats.toString({
                        all: false,
                        errors: true,
                        warnings: true,
                    });

                    reject(new Error(message));

                    return;
                }

                resolve();
            });
        });
    });
};

describe("webpack test", (): void => {
    it("should build via webpack", async (): Promise<void> => {
        await buildWebpack({
            outDir: PATH_DIST,
            cssFilename: "index.css",
        });
    });

    it("should build JS file correctly", async (): Promise<void> => {
        const pathFile: string = Path.join(PATH_DIST, "index.js");

        await assertBuiltJs(pathFile, "var-compatible");
    });

    it("should build CSS file correctly", async (): Promise<void> => {
        const pathFile: string = Path.join(PATH_DIST, "index.css");

        await assertBuiltCss(pathFile);
    });
});

describe("webpack content-hash test", (): void => {
    beforeAll(async (): Promise<void> => {
        await Fsp.rm(PATH_DIST_A, {
            recursive: true,
            force: true,
        });
        await Fsp.rm(PATH_DIST_B, {
            recursive: true,
            force: true,
        });
    });

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
            await buildWebpack({
                outDir: PATH_DIST_A,
                cssFilename: "[name].[contenthash:8].css",
            });

            await Fsp.writeFile(PATH_INDEX_TS, INDEX_TS_EXTRA, "utf-8");

            await buildWebpack({
                outDir: PATH_DIST_B,
                cssFilename: "[name].[contenthash:8].css",
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

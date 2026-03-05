import type { CreatedPaths } from "@ammolite/test-core";

import * as Path from "node:path";

import ammolitePostCSS from "@ammolite/postcss";
import {
    assertBuiltCss,
    assertBuiltJs,
    cleanupPluginArtifacts,
    createPaths,
} from "@ammolite/test-core";
import { AmmolitePlugin } from "@ammolite/unplugin/webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { beforeAll, describe, it } from "vitest";
import webpack from "webpack";

const CWD: string = process.cwd();

const TEST_PATHS: CreatedPaths = createPaths(CWD);

const PATH_DIST: string = TEST_PATHS.dist;

beforeAll(async (): Promise<void> => {
    await cleanupPluginArtifacts(TEST_PATHS);
});

const buildWebpack = async (): Promise<void> => {
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
                        {
                            loader: "css-loader",
                            options: {
                                importLoaders: 1,
                            },
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        ammolitePostCSS(),
                                    ],
                                },
                            },
                        },
                    ],
                },
            ],
        },
        output: {
            path: PATH_DIST,
            filename: "index.js",
        },
        optimization: {
            minimize: false,
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "index.css",
            }),
            new AmmolitePlugin({
                emit: false,
            }),
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
    it("should build via webpack + PostCSS", async (): Promise<void> => {
        await buildWebpack();
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

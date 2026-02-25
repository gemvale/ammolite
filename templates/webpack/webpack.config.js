const path = require("node:path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { AmmolitePlugin } = require("@ammolite/webpack");

/** @type {import("webpack").Configuration} */
const config = (_, argv) => {
    /** @type {string} */
    const mode = argv.mode || "development";

    /** @type {boolean} */
    const isDev = mode === "development";

    /** @type {import("@swc/core").Options} */
    const swcOptions = {
        jsc: {
            parser: {
                syntax: "typescript",
                tsx: true,
            },
            transform: {
                react: {
                    runtime: "automatic",
                    development: isDev,
                },
            },
        },
    };

    /** @type {import("webpack").Configuration["plugins"]} */
    const plugins = [
        !isDev && new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            hash: true,
        }),
        new MiniCssExtractPlugin({
            filename: "index.css",
        }),
        new AmmolitePlugin({
            dev: isDev,
        }),
    ];

    return {
        mode,
        entry: "./src/index.tsx",
        resolve: {
            extensions: [
                ".tsx",
                ".jsx",
                ".ts",
                ".js",
                ".json",
            ],
        },
        module: {
            rules: [
                {
                    test: /\.[jt]sx?$/,
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
                {
                    test: /\.svg$/,
                    type: "asset",
                },
            ],
        },
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "index.js",
        },
        plugins: plugins.filter(Boolean),
    };
};

module.exports = config;

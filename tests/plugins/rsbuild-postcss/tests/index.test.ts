import type { PostCSSLoaderOptions } from "@rsbuild/core";

import * as Fs from "node:fs";
import * as Fsp from "node:fs/promises";
import * as Path from "node:path";

import ammolitePostCSS from "@ammolite/postcss";
import { pluginAmmolite } from "@ammolite/rsbuild";
import { createRsbuild } from "@rsbuild/core";
import { afterAll, describe, expect, it } from "vitest";

const CWD: string = process.cwd();

const PATH_DIST: string = Path.join(CWD, "dist");

const PATH_JS: string = Path.join(PATH_DIST, "static/js/index.js");

const PATH_CSS: string = Path.join(PATH_DIST, "static/css/index.css");

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

afterAll(async (): Promise<void> => {
    await Fsp.rm(PATH_DIST, {
        recursive: true,
        force: true,
    });
});

describe("rsbuild test", (): void => {
    it("should build via Rsbuild", async (): Promise<void> => {
        await buildRsbuild();
    });

    it("should build JS file correctly", async (): Promise<void> => {
        const isFileExists: boolean = Fs.existsSync(PATH_JS);

        expect(isFileExists).toBe(true);

        const fileContent: string = await Fsp.readFile(PATH_JS, "utf-8");

        // bg: var(--xxx)
        expect(fileContent).toMatch(/\bbg:\s*["']var\(--[a-zA-Z0-9_-]+\)["']/);

        // font: var(--xxx)
        expect(fileContent).toMatch(
            /\bfont:\s*["']var\(--[a-zA-Z0-9_-]+\)["']/,
        );

        // const fadeIn = 'kxxx';
        expect(fileContent).toMatch(
            /\b(?:const|let|var)\s+fadeIn\s*=\s*['"]k[a-zA-Z0-9_-]+['"]\s*;/,
        );

        // const spin = 'kxxx';
        expect(fileContent).toMatch(
            /\b(?:const|let|var)\s+spin\s*=\s*['"]k[a-zA-Z0-9_-]+['"]\s*;/,
        );

        // const container = 'xxx xxx xxx';
        expect(fileContent).toMatch(
            /\b(?:const|let|var)\s+container\s*=\s*['"][a-zA-Z0-9_-]+(?:\s+[a-zA-Z0-9_-]+)*['"]\s*;/,
        );
    });

    it("should build CSS file correctly", async (): Promise<void> => {
        const isFileExists: boolean = Fs.existsSync(PATH_CSS);

        expect(isFileExists).toBe(true);

        const fileContent: string = await Fsp.readFile(PATH_CSS, "utf-8");

        // :root { --xxx: #000; }
        expect(fileContent).toMatch(
            /:root\s*\{[^}]*--([a-zA-Z0-9_-]+)\s*:\s*#000\s*;?[^}]*\}/s,
        );

        // :root { --xxx: #fff; }
        expect(fileContent).toMatch(
            /:root\s*\{[^}]*--([a-zA-Z0-9_-]+)\s*:\s*#fff\s*;?[^}]*\}/s,
        );

        // html[data-theme="blue"] { --xxx: #1591ea; }
        expect(fileContent).toMatch(
            /html\[data-theme=["']blue["']\]\s*\{[^}]*--[a-zA-Z0-9_-]+\s*:\s*#1591ea\s*;?[^}]*\}/s,
        );

        // html[data-theme="blue"] { --xxx: #eee; }
        expect(fileContent).toMatch(
            /html\[data-theme=["']blue["']\]\s*\{[^}]*--[a-zA-Z0-9_-]+\s*:\s*#eee\s*;?[^}]*\}/s,
        );

        // @keyframes kxxx { ... }
        expect(fileContent).toMatch(/@keyframes\s+k[a-zA-Z0-9_-]+/);

        // from { opacity: 0 }
        expect(fileContent).toMatch(/opacity:\s*0/);

        // to { opacity: 1 }
        expect(fileContent).toMatch(/opacity:\s*1/);

        // from { transform: rotate(0deg) }
        expect(fileContent).toMatch(/transform:\s*rotate\(0(?:deg)?\)/);

        // to { transform: rotate(360deg) }
        expect(fileContent).toMatch(/transform:\s*rotate\(360(?:deg)?\)/);

        // .xxx { display: block }
        expect(fileContent).toMatch(/display:\s*block/);

        // .xxx { animation-name: kxxx }
        expect(fileContent).toMatch(/animation-name:\s*k[a-zA-Z0-9_-]+/);

        // .xxx { background-color: var(--xxx) }
        expect(fileContent).toMatch(
            /background-color:\s*var\(--([a-zA-Z0-9_-]+)\)/,
        );

        // .xxx { color: var(--xxx) }
        expect(fileContent).toMatch(/color:\s*var\(--([a-zA-Z0-9_-]+)\)/);
    });
});

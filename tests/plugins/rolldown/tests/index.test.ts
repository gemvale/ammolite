import * as Fs from "node:fs";
import * as Fsp from "node:fs/promises";
import * as Path from "node:path";

import { ammolite } from "@ammolite/unplugin/rollup";
import { build } from "rolldown";
import { afterAll, describe, expect, it } from "vitest";

const CWD: string = process.cwd();

const PATH_DIST: string = Path.join(CWD, "dist");

afterAll(async (): Promise<void> => {
    await Fsp.rm(PATH_DIST, {
        recursive: true,
        force: true,
    });
});

describe("vite test", (): void => {
    it("should build via Vite", async (): Promise<void> => {
        await build({
            cwd: process.cwd(),
            input: "src/index.ts",
            output: {
                dir: "dist",
            },
            plugins: [
                ammolite(),
            ],
            logLevel: "warn",
            experimental: {
                attachDebugInfo: "none",
            },
        });
    });

    it("should build JS file correctly", async (): Promise<void> => {
        const pathFile: string = Path.join(PATH_DIST, "index.js");

        const isFileExists: boolean = Fs.existsSync(pathFile);

        expect(isFileExists).toBe(true);

        const fileContent: string = await Fsp.readFile(pathFile, "utf-8");

        // bg: var(--xxx)
        expect(fileContent).toMatch(/\bbg:\s*["']var\(--[a-zA-Z0-9_-]+\)["']/);

        // font: var(--xxx)
        expect(fileContent).toMatch(
            /\bfont:\s*["']var\(--[a-zA-Z0-9_-]+\)["']/,
        );

        // const fadeIn = 'kxxx';
        expect(fileContent).toMatch(
            /\bconst\s+fadeIn\s*=\s*['"]k[a-zA-Z0-9_-]+['"]\s*;/,
        );

        // const spin = 'kxxx';
        expect(fileContent).toMatch(
            /\bconst\s+spin\s*=\s*['"]k[a-zA-Z0-9_-]+['"]\s*;/,
        );

        // const container = 'xxx xxx xxx';
        expect(fileContent).toMatch(
            /\bconst\s+container\s*=\s*['"][a-zA-Z0-9_-]+(?:\s+[a-zA-Z0-9_-]+)*['"]\s*;/,
        );
    });

    it("should build CSS file correctly", async (): Promise<void> => {
        const pathFile: string = Path.join(PATH_DIST, "index.css");

        const isFileExists: boolean = Fs.existsSync(pathFile);

        expect(isFileExists).toBe(true);

        const fileContent: string = await Fsp.readFile(pathFile, "utf-8");

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

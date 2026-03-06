import type { JsDeclarationMode } from "#/@types/mode";

import * as Fs from "node:fs";
import * as Fsp from "node:fs/promises";

import { expect } from "vitest";

const assertBuiltPageHtml = async (pathFile: string): Promise<void> => {
    expect(Fs.existsSync(pathFile)).toBe(true);

    const fileContent: string = await Fsp.readFile(pathFile, "utf-8");

    expect(fileContent).toMatch(/\bid="probe"/);

    // data-bg="var(--xxx)"
    expect(fileContent).toMatch(/\bdata-bg="var\(--[a-zA-Z0-9_-]+\)"/);

    // data-font="var(--xxx)"
    expect(fileContent).toMatch(/\bdata-font="var\(--[a-zA-Z0-9_-]+\)"/);

    // data-fade-in="kxxx"
    expect(fileContent).toMatch(/\bdata-fade-in="k[a-zA-Z0-9_-]+"/);

    // data-spin="kxxx"
    expect(fileContent).toMatch(/\bdata-spin="k[a-zA-Z0-9_-]+"/);

    // data-container="xxx xxx xxx"
    expect(fileContent).toMatch(
        /\bdata-container="[a-zA-Z0-9_-]+(?: [a-zA-Z0-9_-]+)*"/,
    );
};

const assertBuiltJs = async (
    pathFile: string,
    mode: JsDeclarationMode,
): Promise<void> => {
    expect(Fs.existsSync(pathFile)).toBe(true);

    const fileContent: string = await Fsp.readFile(pathFile, "utf-8");

    // bg: var(--xxx)
    expect(fileContent).toMatch(/\bbg:\s*["']var\(--[a-zA-Z0-9_-]+\)["']/);

    // font: var(--xxx)
    expect(fileContent).toMatch(/\bfont:\s*["']var\(--[a-zA-Z0-9_-]+\)["']/);

    const fadeInPattern: RegExp =
        mode === "const-only"
            ? /\bconst\s+fadeIn\s*=\s*['"]k[a-zA-Z0-9_-]+['"]\s*;/
            : /\b(?:const|let|var)\s+fadeIn\s*=\s*['"]k[a-zA-Z0-9_-]+['"]\s*;/;

    const spinPattern: RegExp =
        mode === "const-only"
            ? /\bconst\s+spin\s*=\s*['"]k[a-zA-Z0-9_-]+['"]\s*;/
            : /\b(?:const|let|var)\s+spin\s*=\s*['"]k[a-zA-Z0-9_-]+['"]\s*;/;

    const containerPattern: RegExp =
        mode === "const-only"
            ? /\bconst\s+container\s*=\s*['"][a-zA-Z0-9_-]+(?:\s+[a-zA-Z0-9_-]+)*['"]\s*;/
            : /\b(?:const|let|var)\s+container\s*=\s*['"][a-zA-Z0-9_-]+(?:\s+[a-zA-Z0-9_-]+)*['"]\s*;/;

    // const fadeIn = 'kxxx';
    expect(fileContent).toMatch(fadeInPattern);

    // const spin = 'kxxx';
    expect(fileContent).toMatch(spinPattern);

    // const container = 'xxx xxx xxx';
    expect(fileContent).toMatch(containerPattern);
};

const assertBuiltCss = async (pathFile: string): Promise<void> => {
    expect(Fs.existsSync(pathFile)).toBe(true);

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
        /html\[data-theme=(?:["']blue["']|blue)\]\s*\{[^}]*--[a-zA-Z0-9_-]+\s*:\s*#1591ea\s*;?[^}]*\}/s,
    );

    // html[data-theme="blue"] { --xxx: #eee; }
    expect(fileContent).toMatch(
        /html\[data-theme=(?:["']blue["']|blue)\]\s*\{[^}]*--[a-zA-Z0-9_-]+\s*:\s*#eee\s*;?[^}]*\}/s,
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
    expect(fileContent).toMatch(/transform:\s*rotate\((?:360(?:deg)?|1turn)\)/);

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
};

export { assertBuiltPageHtml, assertBuiltJs, assertBuiltCss };

import { strict as Assert } from "node:assert";
import * as Fs from "node:fs";
import * as Fsp from "node:fs/promises";
import * as Path from "node:path";

type JsDeclarationMode = "const-only" | "var-compatible";

type CreatedPaths = {
    ammolite: string;
    dist: string;
};

const createPaths = (cwd: string): CreatedPaths => {
    return {
        ammolite: Path.join(cwd, "node_modules", ".ammolite"),
        dist: Path.join(cwd, "dist"),
    };
};

const cleanupPluginArtifacts = async (paths: CreatedPaths): Promise<void> => {
    await Fsp.rm(paths.dist, {
        recursive: true,
        force: true,
    });

    await Fsp.rm(paths.ammolite, {
        recursive: true,
        force: true,
    });
};

const assertBuiltJs = async (
    pathFile: string,
    mode: JsDeclarationMode,
): Promise<void> => {
    const isFileExists: boolean = Fs.existsSync(pathFile);

    Assert.equal(isFileExists, true);

    const fileContent: string = await Fsp.readFile(pathFile, "utf-8");

    // bg: var(--xxx)
    Assert.match(fileContent, /\bbg:\s*["']var\(--[a-zA-Z0-9_-]+\)["']/);

    // font: var(--xxx)
    Assert.match(fileContent, /\bfont:\s*["']var\(--[a-zA-Z0-9_-]+\)["']/);

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
    Assert.match(fileContent, fadeInPattern);

    // const spin = 'kxxx';
    Assert.match(fileContent, spinPattern);

    // const container = 'xxx xxx xxx';
    Assert.match(fileContent, containerPattern);
};

const assertBuiltCss = async (pathFile: string): Promise<void> => {
    const isFileExists: boolean = Fs.existsSync(pathFile);

    Assert.equal(isFileExists, true);

    const fileContent: string = await Fsp.readFile(pathFile, "utf-8");

    // :root { --xxx: #000; }
    Assert.match(
        fileContent,
        /:root\s*\{[^}]*--([a-zA-Z0-9_-]+)\s*:\s*#000\s*;?[^}]*\}/s,
    );

    // :root { --xxx: #fff; }
    Assert.match(
        fileContent,
        /:root\s*\{[^}]*--([a-zA-Z0-9_-]+)\s*:\s*#fff\s*;?[^}]*\}/s,
    );

    // html[data-theme="blue"] { --xxx: #1591ea; }
    Assert.match(
        fileContent,
        /html\[data-theme=["']blue["']\]\s*\{[^}]*--[a-zA-Z0-9_-]+\s*:\s*#1591ea\s*;?[^}]*\}/s,
    );

    // html[data-theme="blue"] { --xxx: #eee; }
    Assert.match(
        fileContent,
        /html\[data-theme=["']blue["']\]\s*\{[^}]*--[a-zA-Z0-9_-]+\s*:\s*#eee\s*;?[^}]*\}/s,
    );

    // @keyframes kxxx { ... }
    Assert.match(fileContent, /@keyframes\s+k[a-zA-Z0-9_-]+/);

    // from { opacity: 0 }
    Assert.match(fileContent, /opacity:\s*0/);

    // to { opacity: 1 }
    Assert.match(fileContent, /opacity:\s*1/);

    // from { transform: rotate(0deg) }
    Assert.match(fileContent, /transform:\s*rotate\(0(?:deg)?\)/);

    // to { transform: rotate(360deg) }
    Assert.match(fileContent, /transform:\s*rotate\(360(?:deg)?\)/);

    // .xxx { display: block }
    Assert.match(fileContent, /display:\s*block/);

    // .xxx { animation-name: kxxx }
    Assert.match(fileContent, /animation-name:\s*k[a-zA-Z0-9_-]+/);

    // .xxx { background-color: var(--xxx) }
    Assert.match(fileContent, /background-color:\s*var\(--([a-zA-Z0-9_-]+)\)/);

    // .xxx { color: var(--xxx) }
    Assert.match(fileContent, /color:\s*var\(--([a-zA-Z0-9_-]+)\)/);
};

export type { JsDeclarationMode, CreatedPaths };
export { assertBuiltCss, assertBuiltJs, cleanupPluginArtifacts, createPaths };

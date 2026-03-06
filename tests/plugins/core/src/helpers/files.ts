import type * as Fs from "node:fs";

import * as Fsp from "node:fs/promises";
import * as Path from "node:path";

import { expect } from "vitest";

const normalizePath = (pathFile: string): string => {
    return pathFile.replaceAll(Path.sep, "/");
};

const collectFiles = async (pathDir: string): Promise<string[]> => {
    const entries: Fs.Dirent[] = await Fsp.readdir(pathDir, {
        withFileTypes: true,
    });

    const results: string[][] = await Promise.all(
        entries.map(async (entry: Fs.Dirent): Promise<string[]> => {
            const pathEntry: string = Path.join(pathDir, entry.name);

            if (entry.isDirectory()) {
                return collectFiles(pathEntry);
            }

            if (!entry.isFile()) {
                return [];
            }

            return [
                pathEntry,
            ];
        }),
    );

    return results.flat().sort();
};

const findBuiltFile = async (
    pathDir: string,
    pattern: RegExp,
): Promise<string> => {
    const files: string[] = await collectFiles(pathDir);

    const matchedFiles: string[] = files.filter((pathFile: string): boolean => {
        return pattern.test(normalizePath(pathFile));
    });

    expect(matchedFiles.length).toBe(1);

    const matchedFile: string | undefined = matchedFiles[0];

    if (typeof matchedFile !== "string") {
        throw new Error(`Expected exactly one matched file in ${pathDir}`);
    }

    return matchedFile;
};

export { findBuiltFile };

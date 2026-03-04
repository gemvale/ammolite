import type { CreatedPaths } from "@ammolite/test-core";

import * as Path from "node:path";

import {
    assertBuiltCss,
    assertBuiltJs,
    cleanupPluginArtifacts,
    createPaths,
} from "@ammolite/test-core";
import { ammolite } from "@ammolite/unplugin/rollup";
import typescript from "@rollup/plugin-typescript";
import { rollup } from "rollup";
import { beforeAll, describe, it } from "vitest";

const CWD: string = process.cwd();

const TEST_PATHS: CreatedPaths = createPaths(CWD);

const PATH_DIST: string = TEST_PATHS.dist;

beforeAll(async (): Promise<void> => {
    await cleanupPluginArtifacts(TEST_PATHS);
});

describe("rollup test", (): void => {
    it("should build via Rollup", async (): Promise<void> => {
        const bundle = await rollup({
            input: "src/index.ts",
            plugins: [
                ammolite(),
                typescript({
                    tsconfig: "tsconfig.json",
                    outDir: "dist",
                }),
            ],
            logLevel: "silent",
        });

        await bundle.write({
            dir: "dist",
            format: "esm",
            entryFileNames: "[name].js",
            assetFileNames: "[name][extname]",
        });

        await bundle.close();
    });

    it("should build JS file correctly", async (): Promise<void> => {
        const pathFile: string = Path.join(PATH_DIST, "index.js");

        await assertBuiltJs(pathFile, "const-only");
    });

    it("should build CSS file correctly", async (): Promise<void> => {
        const pathFile: string = Path.join(PATH_DIST, "index.css");

        await assertBuiltCss(pathFile);
    });
});

import type { CreatedPaths } from "@ammolite/test-core";

import * as Path from "node:path";

import {
    assertBuiltCss,
    assertBuiltJs,
    cleanupPluginArtifacts,
    createPaths,
} from "@ammolite/test-core";
import { ammolite } from "@ammolite/unplugin/rollup";
import { build } from "rolldown";
import { beforeAll, describe, it } from "vitest";

const CWD: string = process.cwd();

const TEST_PATHS: CreatedPaths = createPaths(CWD);

const PATH_DIST: string = TEST_PATHS.dist;

beforeAll(async (): Promise<void> => {
    await cleanupPluginArtifacts(TEST_PATHS);
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

        await assertBuiltJs(pathFile, "const-only");
    });

    it("should build CSS file correctly", async (): Promise<void> => {
        const pathFile: string = Path.join(PATH_DIST, "index.css");

        await assertBuiltCss(pathFile);
    });
});

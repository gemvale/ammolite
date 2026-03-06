import type { ChildProcessWithoutNullStreams } from "node:child_process";

import type { NextCreatedPaths } from "@ammolite/test-core";

import { spawn } from "node:child_process";
import * as Path from "node:path";

import {
    assertBuiltCss,
    assertBuiltPageHtml,
    cleanupNextArtifacts,
    createNextPaths,
    findBuiltFile,
} from "@ammolite/test-core";
import { beforeAll, describe, it } from "vitest";

const CWD: string = process.cwd();

const TEST_PATHS: NextCreatedPaths = createNextPaths(CWD);

const PATH_NEXT: string = TEST_PATHS.next;

const PATH_NEXT_BIN: string = Path.join(
    CWD,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "next.cmd" : "next",
);

beforeAll(async (): Promise<void> => {
    await cleanupNextArtifacts(TEST_PATHS);
});

const buildNextTurbopack = async (): Promise<void> => {
    await new Promise<void>((resolve, reject): void => {
        const child: ChildProcessWithoutNullStreams = spawn(
            PATH_NEXT_BIN,
            [
                "build",
            ],
            {
                cwd: CWD,
                env: {
                    ...process.env,
                    NEXT_TELEMETRY_DISABLED: "1",
                },
                stdio: "pipe",
            },
        );

        let stdout: string = "";
        let stderr: string = "";

        child.stdout.setEncoding("utf-8");
        child.stderr.setEncoding("utf-8");

        child.stdout.on("data", (chunk: string): void => {
            stdout += chunk;
        });

        child.stderr.on("data", (chunk: string): void => {
            stderr += chunk;
        });

        child.on("error", (error: Error): void => {
            reject(error);
        });

        child.on("close", (code: number | null): void => {
            if (code === 0) {
                resolve();

                return void 0;
            }

            reject(
                new Error(
                    [
                        `next build exited with code ${code ?? "null"}`,
                        stdout,
                        stderr,
                    ].join("\n"),
                ),
            );
        });
    });
};

describe("next turbopack test", (): void => {
    it("should build via Next.js Turbopack", async (): Promise<void> => {
        await buildNextTurbopack();
    });

    it("should build HTML output correctly", async (): Promise<void> => {
        const pathFile: string = Path.join(
            PATH_NEXT,
            "server",
            "app",
            "index.html",
        );

        await assertBuiltPageHtml(pathFile);
    });

    it("should build CSS output correctly", async (): Promise<void> => {
        const pathFile: string = await findBuiltFile(
            PATH_NEXT,
            /\/static\/.+\.css$/,
        );

        await assertBuiltCss(pathFile);
    });
});

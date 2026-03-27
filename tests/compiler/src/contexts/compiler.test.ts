import type {
    BundlerName,
    CompilerContext,
} from "@ammolite/compiler/contexts/compiler";

import { createCompilerContext } from "@ammolite/compiler/contexts/compiler";
import { describe, expect, it } from "vitest";

const FILE = "/dev/demo/src/index.ts" as const;
const CODE = "export default 0;" as const;
const VERSION = "1.0.0" as const;

const createContext = (bundlerName: BundlerName) => {
    return createCompilerContext({
        file: FILE,
        code: CODE,
        bundler: {
            name: bundlerName,
            version: VERSION,
        },
    });
};

describe("bundler tests", (): void => {
    it.each([
        "webpack",
        "rspack",
        "rollup",
        "vite",
    ] as const)("should resolve tsconfig paths for %s", (bundlerName: BundlerName): void => {
        const context: CompilerContext = createContext(bundlerName);

        expect(context.file).toEqual(FILE);
        expect(context.code).toEqual(CODE);
        expect(context.bundler.name).toEqual(bundlerName);
        expect(context.bundler.version).toEqual(VERSION);
    });
});

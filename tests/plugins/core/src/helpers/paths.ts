import type { CreatedPaths, NextCreatedPaths } from "#/@types/path";

import * as Path from "node:path";

const createPaths = (cwd: string): CreatedPaths => {
    return {
        ammolite: Path.join(cwd, "node_modules", ".ammolite"),
        dist: Path.join(cwd, "dist"),
    };
};

const createNextPaths = (cwd: string): NextCreatedPaths => {
    return {
        ammolite: Path.join(cwd, "node_modules", ".ammolite"),
        next: Path.join(cwd, ".next"),
    };
};

export { createNextPaths, createPaths };

import type { CreatedPaths, NextCreatedPaths } from "#/@types/path";

import * as Fsp from "node:fs/promises";

const cleanupPaths = async (paths: ReadonlyArray<string>): Promise<void> => {
    await Promise.all(
        paths.map(async (pathTarget: string): Promise<void> => {
            await Fsp.rm(pathTarget, {
                recursive: true,
                force: true,
            });
        }),
    );
};

const cleanupPluginArtifacts = async (paths: CreatedPaths): Promise<void> => {
    await cleanupPaths([
        paths.dist,
        paths.ammolite,
    ]);
};

const cleanupNextArtifacts = async (paths: NextCreatedPaths): Promise<void> => {
    await cleanupPaths([
        paths.next,
        paths.ammolite,
    ]);
};

export { cleanupNextArtifacts, cleanupPluginArtifacts };

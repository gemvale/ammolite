import type * as Fs from "node:fs";

import * as Fsp from "node:fs/promises";
import * as Path from "node:path";

type PackageJson = {
    readonly [key: string]: unknown;
    readonly version?: string;
};

const CWD: string = process.cwd();

const ROOT_DIRS = [
    "packages",
    "plugins",
] as const;

const printUsage = (): void => {
    console.log("");
    console.log("Set Ver Script");
    console.log("");
    console.log("Usage:");
    console.log("    node ./scripts/set-ver.ts <version>");
    console.log("");
};

const findPackageJsonPaths = async (
    cwd: string,
): Promise<readonly string[]> => {
    const result: string[] = [];

    for (let i: number = 0; i < ROOT_DIRS.length; i++) {
        const rootDir: string | undefined = ROOT_DIRS[i];

        if (!rootDir) continue;

        const rootPath: string = Path.join(cwd, rootDir);

        const entries: readonly string[] = (await Fsp.readdir(rootPath)).sort();

        for (let j: number = 0; j < entries.length; j++) {
            const entry: string | undefined = entries[j];

            if (!entry) continue;

            const packageDirPath: string = Path.join(rootPath, entry);

            const packageDirStat: Fs.Stats = await Fsp.stat(packageDirPath);

            if (!packageDirStat.isDirectory()) continue;

            result.push(Path.join(packageDirPath, "package.json"));
        }
    }

    return result;
};

const updatePackageVersions = async (
    packageJsonPaths: readonly string[],
    version: string,
): Promise<readonly string[]> => {
    const result: string[] = [];

    for (let i: number = 0; i < packageJsonPaths.length; i++) {
        const packageJsonPath: string | undefined = packageJsonPaths[i];

        if (!packageJsonPath) continue;

        const rawPackageJson: string = await Fsp.readFile(
            packageJsonPath,
            "utf-8",
        );

        const packageJson: PackageJson = JSON.parse(
            rawPackageJson,
        ) as PackageJson;

        const nextPackageJson: string = JSON.stringify(
            {
                ...packageJson,
                version,
            },
            null,
            4,
        ).concat("\n");

        await Fsp.writeFile(packageJsonPath, nextPackageJson);

        result.push(packageJsonPath);
    }

    return result;
};

const main = async (): Promise<void> => {
    const version: string | undefined = process.argv[2];

    const isHelp: boolean = version === "--help" || version === "-h";

    if (isHelp || version === void 0) {
        printUsage();
        return void 0;
    }

    const packageJsonPaths: readonly string[] = await findPackageJsonPaths(CWD);

    const updatedPackageJsonPaths: readonly string[] =
        await updatePackageVersions(packageJsonPaths, version);

    console.log("");

    for (const packageJsonPath of updatedPackageJsonPaths) {
        console.log(`✔ Update completed: ${packageJsonPath}`);
    }

    console.log("");
};

main();

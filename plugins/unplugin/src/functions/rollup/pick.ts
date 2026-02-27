import type { OutputAsset, OutputBundle, OutputChunk } from "rollup";

import type { Output } from "#/functions/output";

import * as Path from "node:path";

const getPriority = (fileName: string): number => {
    const { name }: Path.ParsedPath = Path.parse(fileName);

    if (name === "index") return 0;
    if (name.startsWith("index")) return 1;
    if (name === "style") return 2;
    if (name.startsWith("style")) return 3;
    if (name === "bundle") return 4;
    if (name.startsWith("bundle")) return 5;

    return 6;
};

type PickAssetOptions = {
    bundle: OutputBundle;
    output: Output;
};

const pickAsset = ({
    bundle,
    output,
}: PickAssetOptions): OutputAsset | undefined => {
    const keys: string[] = Object.keys(bundle);

    const result: OutputAsset[] = [];

    for (let i: number = 0; i < keys.length; i++) {
        const key: string | undefined = keys[i];

        if (!key) continue;

        const asset: OutputAsset | OutputChunk | undefined = bundle[key];

        if (!asset) continue;

        if (asset.type !== "asset") continue;

        const parsed: Path.ParsedPath = Path.parse(asset.fileName);

        if (output.isDefault) {
            if (parsed.ext === ".css") {
                result.push(asset);
            }
        } else {
            if (
                (output.dir ? parsed.dir.includes(output.dir) : true) &&
                parsed.base === output.name
            ) {
                return asset;
            }
        }
    }

    result.sort((a: OutputAsset, b: OutputAsset): number => {
        const aPriority: number = getPriority(a.fileName);
        const bPriority: number = getPriority(b.fileName);

        if (aPriority !== bPriority) {
            return aPriority - bPriority;
        }

        return a.fileName.localeCompare(b.fileName);
    });

    return result[0];
};

export type { PickAssetOptions };
export { getPriority, pickAsset };

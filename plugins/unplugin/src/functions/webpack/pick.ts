import type { Asset } from "webpack";

import type { Output } from "#/functions/output";

import * as Path from "node:path";

import { getPriority } from "#/functions/rollup/pick";
import { normalizePath } from "#/functions/webpack/normalize";

type PickAssetOptions = {
    assets: Readonly<Asset>[];
    output: Output;
};

const pickAsset = ({ assets, output }: PickAssetOptions): Asset | undefined => {
    const result: Asset[] = [];

    for (let i: number = 0; i < assets.length; i++) {
        const asset: Asset | undefined = assets[i];

        if (!asset) continue;

        const parsed: Path.ParsedPath = Path.parse(asset.name);

        if (output.isDefault) {
            if (parsed.ext === ".css") {
                result.push(asset);
            }
        } else {
            const parsedDir: string = normalizePath(parsed.dir);

            const outputDir: string | undefined = output.dir
                ? normalizePath(output.dir)
                : void 0;

            if (
                (outputDir ? parsedDir.includes(outputDir) : true) &&
                parsed.base === output.name
            ) {
                return asset;
            }
        }
    }

    result.sort((a: Asset, b: Asset): number => {
        const aPriority: number = getPriority(a.name);
        const bPriority: number = getPriority(b.name);

        if (aPriority !== bPriority) {
            return aPriority - bPriority;
        }

        return a.name.localeCompare(b.name);
    });

    return result[0];
};

export type { PickAssetOptions };
export { pickAsset };

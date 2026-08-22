import type { OutputBundle, OutputChunk } from "rollup";

type ChunkWithViteMetadata = OutputChunk & {
    viteMetadata?: {
        importedCss?: Set<string> | string[];
    };
};

type ReplaceBundleReferencesOptions = {
    bundle: OutputBundle;
    oldFileName: string;
    nextFileName: string;
};

const replaceBundleReferences = ({
    bundle,
    oldFileName,
    nextFileName,
}: ReplaceBundleReferencesOptions): void => {
    if (oldFileName === nextFileName) return void 0;

    for (const entry of Object.values(bundle)) {
        if (entry.type === "chunk") {
            const chunk: ChunkWithViteMetadata = entry;

            const importedCss: Set<string> | string[] | undefined =
                chunk.viteMetadata?.importedCss;

            if (importedCss) {
                if (importedCss instanceof Set) {
                    importedCss.delete(oldFileName);
                    importedCss.add(nextFileName);
                } else {
                    const index: number = importedCss.indexOf(oldFileName);

                    if (index !== -1) {
                        importedCss.splice(index, 1);
                    }

                    if (!importedCss.includes(nextFileName)) {
                        importedCss.push(nextFileName);
                    }
                }
            }

            if (chunk.code.includes(oldFileName)) {
                chunk.code = chunk.code.split(oldFileName).join(nextFileName);
            }
        } else {
            if (
                typeof entry.source === "string" &&
                entry.source.includes(oldFileName)
            ) {
                entry.source = entry.source
                    .split(oldFileName)
                    .join(nextFileName);
            }
        }
    }
};

export type { ReplaceBundleReferencesOptions };
export { replaceBundleReferences };

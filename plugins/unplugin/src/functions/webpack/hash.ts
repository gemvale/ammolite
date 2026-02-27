import type { Compilation, Compiler } from "webpack";

type CreateGetHashContentOptions = {
    compiler: Compiler;
    compilation: Compilation;
};

type GetHashContent = (source: string) => string;

const createGetHashContent = ({
    compiler,
    compilation,
}: CreateGetHashContentOptions): GetHashContent => {
    const { hashDigest, hashDigestLength, hashFunction, hashSalt } =
        compilation.outputOptions;

    const hash = compiler.webpack.util.createHash(hashFunction ?? "md5");

    if (hashSalt) hash.update(hashSalt);

    return (source: string): string => {
        hash.update(source);

        return hash.digest(hashDigest).toString().slice(0, hashDigestLength);
    };
};

export type { CreateGetHashContentOptions, GetHashContent };
export { createGetHashContent };

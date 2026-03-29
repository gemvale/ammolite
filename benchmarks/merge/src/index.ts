import type { StyleValue } from "ammolite";

// These values mirror Ammolite's hashed style titles so merge collides on realistic 4-char prefixes.
const cardBase: string = "djcd17uu pze6fwxy b8unz5j3 ch8skiaw f1jl1omc";

const layoutRow: string = "djcd1agm a1am1ezc gk3nfwxy";

const toneMuted: string = "ch8sj3nx b1n4zixa";

const spacingCompact: string = "pze6ylju m1zjew93";

const stateDefault: string = "b8unw8mu b1iy1s5f";

const typographyStrong: string = "f1jlylju lox0163j fv5c1wjt";

const layoutStack: string = "djcd1pa1 gk3nylju";

const toneAccent: string = "ch8s14re b1n4upf2";

const spacingRelaxed: string = "pze61hln m1zj1zh7";

const stateActive: string = "b8un1m4o b1iyhgeo";

const mergeValuesSmall: readonly StyleValue[] = [
    cardBase,
    layoutRow,
    toneMuted,
];

const mergeValuesNullable: readonly StyleValue[] = [
    cardBase,
    null,
    layoutRow,
    void 0,
    toneMuted,
    spacingCompact,
];

const mergeValuesLarge: readonly StyleValue[] = [
    cardBase,
    layoutRow,
    toneMuted,
    spacingCompact,
    stateDefault,
    null,
    typographyStrong,
    layoutStack,
    toneAccent,
    spacingRelaxed,
    void 0,
    stateActive,
];

export { mergeValuesLarge, mergeValuesNullable, mergeValuesSmall };

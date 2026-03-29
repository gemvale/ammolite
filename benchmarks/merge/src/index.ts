import type { StyleValue } from "ammolite";

// Matching 4-char prefixes mirror how merge resolves later classes over earlier ones.
const cardBase: string = "disp0001 padd0001 bord0001 colo0001 font0001";

const layoutRow: string = "disp0002 alig0001 gap_0001";

const toneMuted: string = "colo0002 back0001";

const spacingCompact: string = "padd0002 marg0001";

const stateDefault: string = "bord0002 shad0001";

const typographyStrong: string = "font0002 line0001 weig0001";

const layoutStack: string = "disp0003 gap_0002";

const toneAccent: string = "colo0003 back0002";

const spacingRelaxed: string = "padd0003 marg0002";

const stateActive: string = "bord0003 shad0002";

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

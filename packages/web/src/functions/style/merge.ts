/**
 * Style value type.
 */
type StyleValue = string | null | undefined;

/**
 * Merge multiple styles.
 *
 * ### Example
 *
 * ```ts
 * import { style, merge } from "ammolite";
 *
 * const styleA: string = style({
 *     backgroundColor: "red",
 * });
 *
 * const styleB: string = style({
 *     backgroundColor: "blue",
 * });
 *
 * // background-color: blue;
 * const containerA: string = merge(styleA, styleB);
 * ```
 */
const merge = (...styles: StyleValue[]): string => {
    const map: Record<string, string> = Object.create(null);

    for (const style of styles) {
        if (!style) continue;

        for (const cls of style.split(" ")) {
            if (!cls) continue;

            if (cls.length < 4) throw new Error(`Invalid class: ${cls}`);

            map[cls.slice(0, 4)] = cls;
        }
    }

    return Object.values(map).join(" ");
};

export type { StyleValue };
export { merge };

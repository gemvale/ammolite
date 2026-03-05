import { style } from "ammolite";

import { fadeIn } from "../keyframes";
import { colors } from "../variables";

const container: string = style({
    display: "block",
    animationName: fadeIn,
    backgroundColor: colors.bg,
    color: colors.font,
});

export { container };

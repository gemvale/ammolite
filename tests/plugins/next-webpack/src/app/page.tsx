import type * as React from "react";

import { fadeIn, spin } from "../keyframes";
import { container } from "../style";
import { colors } from "../variables";

export default (): React.JSX.Element => {
    return (
        <main
            id="probe"
            className={container}
            data-bg={colors.bg}
            data-container={container}
            data-fade-in={fadeIn}
            data-font={colors.font}
            data-spin={spin}
        />
    );
};

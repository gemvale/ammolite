import { variables } from "ammolite";

const themeBlue = "html[data-theme='blue']" as const;

type Colors = {
    bg: string;
    font: string;
};

const colors: Colors = variables({
    bg: {
        default: "#fff",
        [themeBlue]: "#1591ea",
    },
    font: {
        default: "#000",
        [themeBlue]: "#eee",
    },
});

export { colors };

/** @type {import("postcss-preset-env").pluginOptions} */
const presetEnvOptions = {
    autoprefixer: {
        flexbox: "no-2009",
    },
    stage: 3,
    features: {
        "custom-properties": false,
    },
};

/** @type {import("@ammolite/postcss").PluginOptions} */
const ammoliteOptions = {};

/** @type {import("postcss-load-config").Config} */
export default {
    plugins: [
        [
            "postcss-preset-env",
            presetEnvOptions,
        ],
        "postcss-flexbugs-fixes",
        [
            "@ammolite/postcss",
            ammoliteOptions,
        ],
    ],
};

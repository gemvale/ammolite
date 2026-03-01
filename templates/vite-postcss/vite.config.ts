import ammolitePostCSS from "@ammolite/postcss";
import { ammolite } from "@ammolite/unplugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        ammolite({
            emit: false,
        }),
        react(),
    ],
    css: {
        postcss: {
            plugins: [
                // @ts-expect-error postcss version unmatched
                ammolitePostCSS(),
            ],
        },
    },
    server: {
        port: 3001,
    },
    preview: {
        port: 3000,
    },
});

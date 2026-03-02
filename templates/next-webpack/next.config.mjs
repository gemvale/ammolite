import { ammolite } from "@ammolite/next/webpack";

/** @type {import("next").NextConfig} */
const nextConfig = {
    trailingSlash: false,
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
            },
            {
                protocol: "https",
                hostname: "**",
            },
        ],
        unoptimized: true,
    },
    reactStrictMode: true,
};

const withAmmolite = ammolite();

// @ts-expect-error next version unmatched
export default withAmmolite(nextConfig);

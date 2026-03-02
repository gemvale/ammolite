import type { NextConfig } from "next";

import { ammolite } from "@ammolite/next/turbopack";

const nextConfig: NextConfig = {
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

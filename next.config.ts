import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

const nextConfig: NextConfig = {
    cacheComponents: true,
    partialPrefetching: true
};

export default withSerwist(nextConfig);
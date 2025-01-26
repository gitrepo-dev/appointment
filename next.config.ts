import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    /** Only run ESLint on these directories with `next lint` and `next build`. */
    dirs: ['src'],
    /** Do not run ESLint during production builds (`next build`). */
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;

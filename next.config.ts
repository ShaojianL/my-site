import type { NextConfig } from "next";

// Deployed as a GitHub Pages project site, so assets must be served under /scheduler
const basePath = "/scheduler";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

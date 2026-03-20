import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Prevent Turbopack from incorrectly inferring the workspace root when
  // multiple lockfiles/package.json exist in parent directories.
  turbopack: {
    root: projectRoot,
  },
  webpack: (config, { isServer }) => {
    // Suppress DEP0169 deprecation warning from url.parse() in dependencies
    if (!isServer) {
      config.ignoreWarnings = config.ignoreWarnings || [];
      config.ignoreWarnings.push({
        module: /node_modules/,
        message: /DEP0169/,
      });
    }
    return config;
  },
};

export default nextConfig;

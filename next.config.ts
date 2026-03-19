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
};

export default nextConfig;

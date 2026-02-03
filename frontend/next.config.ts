import type { NextConfig } from "next";

import { dirname } from "path";
import { fileURLToPath } from "url";

const configDir = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    // Prevent Next from inferring a parent folder as the workspace root when
    // multiple lockfiles exist elsewhere on the machine.
    root: configDir,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;

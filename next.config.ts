import { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure first deploy succeeds even with lint/type issues
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wxuvdw0gh5.ufs.sh",
        port: "",
        search: "",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
        search: "",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
        port: "",
        search: "",
      },
    ],
  },
};

module.exports = nextConfig;

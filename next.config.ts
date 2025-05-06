import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
  },
};

export default nextConfig;

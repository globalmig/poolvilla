import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "img.einet.kr",
        pathname: "/P202310004/**",
      },
    ],
  },
};

export default nextConfig;

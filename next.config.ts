import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8081";

const nextConfig: NextConfig = {
  /** 브라우저 → Next(3000) → Spring(8081) 프록시 — CORS 우회 */
  async rewrites() {
    return [
      {
        source: "/api/menus",
        destination: `${backendUrl}/api/menus`,
      },
    ];
  },
};

export default nextConfig;

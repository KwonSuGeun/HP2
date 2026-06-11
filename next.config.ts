import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8081";

const nextConfig: NextConfig = {
  /** 구 account 경로 → `/admin/staff` */
  async redirects() {
    return [
      { source: "/admin/accounts", destination: "/admin/staff", permanent: false },
      { source: "/admin/account-management", destination: "/admin/staff", permanent: false },
    ];
  },
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

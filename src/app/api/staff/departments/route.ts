import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8081";

/** GET /api/staff/departments → 백엔드 GET /admin/staff/departments */
export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/admin/staff/departments`, { cache: "no-store" });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { code: "500", message: "백엔드 연결 실패", data: null },
      { status: 500 },
    );
  }
}

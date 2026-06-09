import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8081";

const LIST_QUERY_KEYS = ["dept", "staffRankCode", "status", "keyword"] as const;

function buildBackendStaffListUrl(searchParams: URLSearchParams): string {
  const query = new URLSearchParams();

  for (const key of LIST_QUERY_KEYS) {
    query.set(key, searchParams.get(key) ?? "");
  }

  return `${BACKEND_URL}/admin/staff?${query.toString()}`;
}

/** GET /api/staff → 백엔드 GET /admin/staff (직원 목록/검색) */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const response = await fetch(buildBackendStaffListUrl(searchParams), { cache: "no-store" });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { code: "500", message: "백엔드 연결 실패", data: null },
      { status: 500 },
    );
  }
}

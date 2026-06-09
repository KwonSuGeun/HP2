import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8081";

/** GET /api/staff/{staffId} → 백엔드 직원 상세 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ staffId: string }> },
) {
  try {
    const { staffId } = await context.params;
    const response = await fetch(`${BACKEND_URL}/admin/staff/${staffId}`, { cache: "no-store" });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { code: "500", message: "백엔드 연결 실패", data: null },
      { status: 500 },
    );
  }
}

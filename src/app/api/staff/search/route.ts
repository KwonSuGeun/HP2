import { NextRequest, NextResponse } from "next/server";
import { enrichStaffDto } from "@/features/accounts/staffEnrichment";
import type { StaffDto } from "@/features/accounts/AccountTypes";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8081";

/** POST /api/staff/search → 백엔드 POST /admin/staff/search */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/admin/staff/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const data = await response.json();

    if (response.ok && Array.isArray(data?.data)) {
      data.data = (data.data as StaffDto[]).map(enrichStaffDto);
    }

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { code: "500", message: "백엔드 연결 실패", data: null },
      { status: 500 },
    );
  }
}

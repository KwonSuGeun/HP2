import { NextRequest, NextResponse } from "next/server";
import { enrichStaffDto, fetchDepartmentExtensionMap } from "@/features/staff/staffEnrichment";
import type { StaffDto } from "@/features/staff/StaffTypes";

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

    if (response.ok && data?.data) {
      const departmentExtensions = await fetchDepartmentExtensionMap(BACKEND_URL);
      data.data = enrichStaffDto(data.data as StaffDto, { departmentExtensions });
    }

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { code: "500", message: "백엔드 연결 실패", data: null },
      { status: 500 },
    );
  }
}

/** DELETE /api/staff/{staffId} → 백엔드 직원 삭제 */
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ staffId: string }> },
) {
  try {
    const { staffId } = await context.params;
    const response = await fetch(`${BACKEND_URL}/admin/staff/${staffId}`, {
      method: "DELETE",
      cache: "no-store",
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { code: "500", message: "백엔드 연결 실패", data: null },
      { status: 500 },
    );
  }
}
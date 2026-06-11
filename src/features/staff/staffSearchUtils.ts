import type { Staff, StaffListRequest, StaffSearchParams } from "./StaffTypes";

export type { StaffSearchParams };

export function buildStaffListRequest(params: StaffSearchParams): StaffListRequest {
  const request: StaffListRequest = {};

  if (params.department) {
    request.dept = params.department;
  }

  if (params.keyword.trim()) {
    const trimmed = params.keyword.trim();
    if (params.criteria === "name" || params.criteria === "staffId") {
      request.keyword = trimmed;
    }
  }

  return request;
}

export function applyClientFilters(staffList: Staff[], params: StaffSearchParams): Staff[] {
  let result = staffList;

  if (params.jobRole) {
    const roleAliases: Record<string, string[]> = {
      DOCTOR: ["DOCTOR", "DOC"],
      NURSE: ["NURSE", "NUR"],
      ADMIN: ["ADMIN", "ADM"],
      STAFF: ["STAFF"],
      MANAGER: ["MANAGER"],
    };
    const allowed = roleAliases[params.jobRole] ?? [params.jobRole];
    result = result.filter((staff) => allowed.includes(staff.staffType));
  }

  if (params.keyword.trim()) {
    const lower = params.keyword.trim().toLowerCase();
    if (params.criteria === "department") {
      result = result.filter((staff) => staff.department.toLowerCase().includes(lower));
    } else if (params.criteria === "phoneNumber") {
      result = result.filter((staff) =>
        staff.phoneNumber.replace(/\D/g, "").includes(lower.replace(/\D/g, "")),
      );
    }
  }

  return result;
}

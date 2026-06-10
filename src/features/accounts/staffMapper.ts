import type { Employee, EmployeeStatus, StaffDto } from "./AccountTypes";
import { DEPARTMENT_OPTIONS, RANK_LABEL } from "./formConstants";
import {
  applyStaffDetailCache,
  enrichStaffDto,
  inferStaffRoleCode,
  inferStaffType,
  parseStaffAddress,
  readStaffDetailCache,
} from "./staffEnrichment";

const STAFF_TYPE_PREFIX: Record<string, string> = {
  DOCTOR: "Dr.",
  DOC: "Dr.",
  NURSE: "Ns.",
  NUR: "Ns.",
  ADMIN: "L.s.",
  ADM: "L.s.",
};

function toEmployeeStatus(status: string): EmployeeStatus {
  if (status === "LEAVE" || status === "휴직") return "LEAVE";
  if (status === "RETIRED" || status === "퇴직") return "RETIRED";
  return "ACTIVE";
}

function formatDisplayName(staffName: string, staffType: string): string {
  const prefix = STAFF_TYPE_PREFIX[staffType];
  if (!prefix || staffName.startsWith(prefix)) return staffName;
  return `${prefix} ${staffName}`;
}

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

function formatDateValue(value?: string | null): string {
  if (!value) return "";
  return value.length >= 10 ? value.slice(0, 10) : value;
}

function resolveDepartmentLabel(departmentId: string, departmentName?: string): string {
  if (departmentName?.trim()) return departmentName;
  return DEPARTMENT_OPTIONS.find((option) => option.value === departmentId)?.label ?? departmentId;
}

function normalizeDto(dto: StaffDto, useCache: boolean): StaffDto {
  const cached = useCache ? applyStaffDetailCache(dto, readStaffDetailCache(dto.staffId)) : dto;
  return enrichStaffDto(cached);
}

export function staffDtoToEmployee(dto: StaffDto, options?: { useCache?: boolean }): Employee {
  const normalized = normalizeDto(dto, options?.useCache ?? false);
  const staffType = inferStaffType(normalized.staffDepartmentId, normalized.staffType);
  const staffRoleCode = inferStaffRoleCode(staffType, normalized.staffRoleCode);
  const address = parseStaffAddress(normalized.staffAddress);

  return {
    id: normalized.staffId,
    profileImage: null,
    name: formatDisplayName(normalized.staffName, staffType),
    birthDate: formatDateValue(normalized.staffBirthDate),
    department: resolveDepartmentLabel(normalized.staffDepartmentId, normalized.staffDepartmentName),
    departmentId: normalized.staffDepartmentId,
    email: normalized.staffEmail ?? "",
    phoneNumber: formatPhone(normalized.staffPhone ?? ""),
    zipCode: address.zipCode,
    baseAddress: address.baseAddress,
    detailAddress: address.detailAddress,
    staffAddress: normalized.staffAddress ?? "",
    licenseNumber: normalized.staffLicenseNo ?? "",
    employeeId: normalized.staffId,
    position: RANK_LABEL[normalized.staffRankCode] ?? normalized.staffRankCode,
    status: toEmployeeStatus(normalized.staffStatus),
    staffType,
    staffRankCode: normalized.staffRankCode,
    staffPositionCode: normalized.staffPositionCode ?? normalized.staffRankCode ?? "",
    staffRoleCode,
    staffExtensionNo: normalized.staffExtensionNo ?? "",
    staffHireDate: formatDateValue(normalized.staffHireDate),
    rawStaffStatus: normalized.staffStatus ?? "",
  };
}

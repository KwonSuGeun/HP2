import type { Employee, EmployeeStatus, StaffDto } from "./AccountTypes";
import { DEPARTMENT_OPTIONS, RANK_LABEL } from "./formConstants";

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

function resolveDepartmentLabel(departmentId: string): string {
  return DEPARTMENT_OPTIONS.find((option) => option.value === departmentId)?.label ?? departmentId;
}

export function staffDtoToEmployee(dto: StaffDto): Employee {
  return {
    id: dto.staffId,
    profileImage: null,
    name: formatDisplayName(dto.staffName, dto.staffType ?? ""),
    birthDate: dto.staffBirthDate ?? "",
    department: dto.staffDepartmentName ?? resolveDepartmentLabel(dto.staffDepartmentId),
    departmentId: dto.staffDepartmentId,
    email: dto.staffEmail ?? "",
    phoneNumber: formatPhone(dto.staffPhone ?? ""),
    zipCode: "",
    baseAddress: "",
    detailAddress: "",
    licenseNumber: dto.staffLicenseNo ?? "",
    employeeId: dto.staffId,
    position: RANK_LABEL[dto.staffRankCode] ?? dto.staffRankCode,
    status: toEmployeeStatus(dto.staffStatus),
    staffType: dto.staffType ?? "",
    staffRankCode: dto.staffRankCode,
    staffPositionCode: dto.staffPositionCode ?? "",
    staffRoleCode: dto.staffRoleCode ?? "",
    staffExtensionNo: dto.staffExtensionNo ?? "",
    staffHireDate: dto.staffHireDate ?? "",
  };
}

import type { EmployeeRegisterForm, StaffRegisterRequest } from "./AccountTypes";
import { DEPARTMENT_OPTIONS } from "./formConstants";

function inferStaffType(departmentId: string): string {
  return DEPARTMENT_OPTIONS.find((option) => option.value === departmentId)?.staffType ?? "ADM";
}

function normalizeStaffType(staffType: string): string {
  if (staffType === "DOC" || staffType === "NUR" || staffType === "ADM") return staffType;
  if (staffType === "DOCTOR") return "DOC";
  if (staffType === "NURSE") return "NUR";
  return "ADM";
}

function inferStaffRoleCode(staffType: string): string {
  const normalized = normalizeStaffType(staffType);
  if (normalized === "DOC") return "ROLE_DOCTOR";
  if (normalized === "NUR") return "ROLE_NURSE";
  return "ROLE_ADMIN";
}

export function isMedicalStaff(departmentId: string): boolean {
  const staffType = normalizeStaffType(inferStaffType(departmentId));
  return staffType === "DOC" || staffType === "NUR";
}

export function formToStaffRegisterRequest(form: EmployeeRegisterForm): StaffRegisterRequest {
  const staffType = normalizeStaffType(inferStaffType(form.departmentId));
  const today = new Date().toISOString().slice(0, 10);

  return {
    staffId: form.employeeId.trim(),
    staffPassword: form.password,
    staffName: form.name.trim(),
    staffBirthDate: form.birthDate,
    staffDepartmentId: form.departmentId,
    staffType,
    staffRoleCode: inferStaffRoleCode(staffType),
    staffRankCode: "사원",
    staffHireDate: today,
    staffEmail: form.email.trim() || undefined,
    staffPhone: form.phoneNumber.trim(),
    staffLicenseNo: form.licenseNumber.trim() || undefined,
  };
}

export function formatAddress(employee: {
  zipCode: string;
  baseAddress: string;
  detailAddress: string;
}): string {
  const parts = [employee.zipCode, employee.baseAddress, employee.detailAddress].filter(Boolean);
  return parts.join(" ");
}

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

/** Java @Pattern(regexp = "^010-?\\d{4}-?\\d{4}$") 와 동일 — 하이픈 유무 무관 */
export const KOREAN_MOBILE_PHONE_PATTERN = /^010-?\d{4}-?\d{4}$/;

export const KOREAN_MOBILE_PHONE_INVALID_MESSAGE =
  "휴대폰 번호는 010으로 시작하는 11자리 숫자 형식이어야 합니다.";

export function isValidKoreanMobilePhone(phone: string): boolean {
  const trimmed = phone.trim();
  if (!trimmed) return false;
  return KOREAN_MOBILE_PHONE_PATTERN.test(trimmed);
}

export function normalizeKoreanMobilePhone(phone: string): string {
  return phone.replace(/\D/g, "");
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
    staffPhone: normalizeKoreanMobilePhone(form.phoneNumber),
    staffLicenseNo: form.licenseNumber.trim() || undefined,
    addressZipCode: form.zipCode.trim(),
    addressBase: form.baseAddress.trim(),
    addressDetail: form.detailAddress.trim() || undefined,
  };
}

export function formatAddress(employee: {
  zipCode: string;
  baseAddress: string;
  detailAddress: string;
  staffAddress?: string;
}): string {
  const parts = [employee.zipCode, employee.baseAddress, employee.detailAddress].filter(Boolean);
  if (parts.length > 0) return parts.join(" ");
  return employee.staffAddress?.trim() || "-";
}

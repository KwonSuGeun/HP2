import type { DepartmentDto, StaffRegisterForm, StaffDto } from "./StaffTypes";
import { DEPARTMENT_EXTENSION_BY_ID, DEPARTMENT_OPTIONS } from "./formConstants";

const ROLE_CODE_BY_TYPE: Record<string, string> = {
  DOC: "ROLE_DOCTOR",
  NUR: "ROLE_NURSE",
  ADM: "ROLE_ADMIN",
};

let departmentExtensionById: Record<string, string> = { ...DEPARTMENT_EXTENSION_BY_ID };

export function setDepartmentExtensionMap(map: Record<string, string>) {
  departmentExtensionById = { ...DEPARTMENT_EXTENSION_BY_ID, ...map };
}

export function mergeDepartmentExtensions(
  ...maps: Array<Record<string, string> | undefined>
): Record<string, string> {
  return maps.reduce<Record<string, string>>(
    (merged, map) => ({ ...merged, ...map }),
    { ...DEPARTMENT_EXTENSION_BY_ID },
  );
}

export function getDepartmentExtension(departmentId: string): string {
  return departmentExtensionById[departmentId]?.trim() ?? "";
}

export async function fetchDepartmentExtensionMap(backendUrl: string): Promise<Record<string, string>> {
  try {
    const response = await fetch(`${backendUrl}/admin/staff/departments`, { cache: "no-store" });
    const payload = await response.json();
    if (!Array.isArray(payload?.data)) return {};

    return mergeDepartmentExtensions(
      Object.fromEntries(
        (payload.data as DepartmentDto[])
          .filter((department) => department.departmentId && department.staffExtensionNo?.trim())
          .map((department) => [department.departmentId, department.staffExtensionNo!.trim()]),
      ),
    );
  } catch {
    return { ...DEPARTMENT_EXTENSION_BY_ID };
  }
}

function resolveStaffExtensionNo(
  dto: StaffDto,
  departmentExtensions: Record<string, string>,
): string | undefined {
  const fromStaff = dto.staffExtensionNo?.trim();
  if (fromStaff) return fromStaff;

  const fromDepartment = departmentExtensions[dto.staffDepartmentId]?.trim();
  return fromDepartment || undefined;
}

export function inferStaffType(departmentId: string, staffType?: string): string {
  if (staffType?.trim()) return staffType.trim();
  return DEPARTMENT_OPTIONS.find((option) => option.value === departmentId)?.staffType ?? "ADM";
}

export function inferStaffRoleCode(staffType: string, staffRoleCode?: string): string {
  if (staffRoleCode?.trim()) return staffRoleCode.trim();
  return ROLE_CODE_BY_TYPE[staffType] ?? "ROLE_ADMIN";
}

export function parseStaffAddress(staffAddress?: string | null): {
  zipCode: string;
  baseAddress: string;
  detailAddress: string;
} {
  if (!staffAddress?.trim()) {
    return { zipCode: "", baseAddress: "", detailAddress: "" };
  }

  const trimmed = staffAddress.trim();
  const bracketMatch = trimmed.match(/^\[([^\]]+)\]\s*(.*)$/);
  if (!bracketMatch) {
    return { zipCode: "", baseAddress: trimmed, detailAddress: "" };
  }

  return {
    zipCode: bracketMatch[1].trim(),
    baseAddress: bracketMatch[2].trim(),
    detailAddress: "",
  };
}

export function enrichStaffDto(
  dto: StaffDto,
  options?: { departmentExtensions?: Record<string, string> },
): StaffDto {
  const staffType = inferStaffType(dto.staffDepartmentId, dto.staffType);
  const departmentExtensions = mergeDepartmentExtensions(
    departmentExtensionById,
    options?.departmentExtensions,
  );

  return {
    ...dto,
    staffType,
    staffRoleCode: inferStaffRoleCode(staffType, dto.staffRoleCode),
    staffPositionCode: dto.staffPositionCode?.trim() || dto.staffRankCode || "",
    staffExtensionNo: resolveStaffExtensionNo(dto, departmentExtensions),
  };
}

const DETAIL_CACHE_PREFIX = "staffDetailCache:";

type StaffDetailCache = Partial<StaffRegisterForm> & {
  staffHireDate?: string;
};

export function readStaffDetailCache(staffId: string): StaffDetailCache | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(`${DETAIL_CACHE_PREFIX}${staffId}`);
    return raw ? (JSON.parse(raw) as StaffDetailCache) : null;
  } catch {
    return null;
  }
}

export function writeStaffDetailCache(staffId: string, form: StaffRegisterForm) {
  if (typeof window === "undefined") return;
  const payload: StaffDetailCache = {
    ...form,
    staffHireDate: new Date().toISOString().slice(0, 10),
  };
  window.localStorage.setItem(`${DETAIL_CACHE_PREFIX}${staffId}`, JSON.stringify(payload));
}

export function removeStaffDetailCache(staffId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(`${DETAIL_CACHE_PREFIX}${staffId}`);
}

export function applyStaffDetailCache(dto: StaffDto, cache: StaffDetailCache | null): StaffDto {
  if (!cache) return dto;

  return {
    ...dto,
    staffBirthDate: dto.staffBirthDate ?? cache.birthDate,
    staffEmail: dto.staffEmail ?? cache.email,
    staffLicenseNo: dto.staffLicenseNo ?? cache.licenseNumber,
    staffHireDate: dto.staffHireDate ?? cache.staffHireDate,
    staffAddress: dto.staffAddress ?? buildStaffAddressFromForm(cache),
  };
}

function buildStaffAddressFromForm(form: Partial<StaffRegisterForm>): string | undefined {
  if (!form.zipCode?.trim() && !form.baseAddress?.trim()) return undefined;
  const base = `[${form.zipCode?.trim() ?? ""}] ${form.baseAddress?.trim() ?? ""}`.trim();
  if (!form.detailAddress?.trim()) return base;
  return `${base} ${form.detailAddress.trim()}`;
}

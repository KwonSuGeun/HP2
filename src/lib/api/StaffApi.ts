import { api } from "@/lib/Axios";
import { getStaffApiBase } from "@/lib/api/staffApiPaths";
import type { ApiResponse } from "@/lib/api/types/ApiResponse";
export type StaffItem = {
  staffId: string;
  staffName: string;
  staffDepartmentId: string;
  staffDepartmentName?: string;
  staffRankCode?: string;
  staffPhone?: string;
  staffAddress?: string;
  staffStatus?: string;
};

export type StaffListRequest = {
  staffId?: string;
  dept?: string;
  staffRankCode?: string;
  keyword?: string;
};

export type StaffRegisterRequest = {
  staffId: string;
  staffPassword: string;
  staffName: string;
  staffType: string;
  staffDepartmentId: string;
  staffRankCode: string;
  staffPhone: string;
  staffBirthDate: string;
  staffHireDate: string;
  addressZipCode: string;
  addressBase: string;
  addressDetail?: string;
  staffEmail?: string;
  staffLicenseNo?: string;
};

export type DepartmentItem = {
  departmentId: string;
  departmentName: string;
};

export async function fetchStaffListApi(
  request: StaffListRequest = {},
): Promise<StaffItem[]> {
  const response = await api.post<ApiResponse<StaffItem[]>>(
    `${getStaffApiBase()}/search`,
    request,
  );
  return response.data.data ?? [];
}

export async function fetchStaffByIdApi(staffId: string): Promise<StaffItem> {
  const response = await api.get<ApiResponse<StaffItem>>(
    `${getStaffApiBase()}/${staffId}`,
  );
  return response.data.data;
}

export async function registerStaffApi(
  request: StaffRegisterRequest,
): Promise<void> {
  await api.post<ApiResponse<null>>(`${getStaffApiBase()}/register`, request);
}

export async function fetchDepartmentListApi(): Promise<DepartmentItem[]> {
  const response = await api.get<ApiResponse<DepartmentItem[]>>(
    `${getStaffApiBase()}/departments`,
  );
  return response.data.data ?? [];
}
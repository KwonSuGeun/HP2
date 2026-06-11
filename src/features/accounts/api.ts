import { api } from "@/lib/Axios";
import { getStaffApiBase } from "@/lib/api/staffApiPaths";
import type { ApiResponse } from "@/lib/api/types/ApiResponse";
import type { DepartmentDto, StaffDto, StaffListRequest, StaffRegisterRequest } from "./AccountTypes";

const staffBase = getStaffApiBase();

export const fetchStaffListAPI = (request: StaffListRequest) => {
  return api.post<ApiResponse<StaffDto[]>>(`${staffBase}/search`, request);
};

export const fetchStaffDetailAPI = (staffId: string) => {
  return api.get<ApiResponse<StaffDto>>(`${staffBase}/${staffId}`);
};

export const registerStaffAPI = (request: StaffRegisterRequest) => {
  return api.post<ApiResponse<null>>(`${staffBase}/register`, request);
};

export const deleteStaffAPI = (staffId: string) => {
  return api.delete<ApiResponse<null>>(`${staffBase}/${staffId}`);
};

export const fetchDepartmentListAPI = () => {
  return api.get<ApiResponse<DepartmentDto[]>>(`${staffBase}/departments`);
};
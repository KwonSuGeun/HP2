import { api } from "@/lib/Axios";
import type { ApiResponse, StaffDto, StaffListRequest, StaffRegisterRequest } from "./AccountTypes";

const STAFF_BASE = "/admin/staff";

export const fetchStaffListAPI = (request: StaffListRequest) => {
  return api.post<ApiResponse<StaffDto[]>>(`${STAFF_BASE}/search`, request);
};

export const fetchStaffDetailAPI = (staffId: string) => {
  return api.get<ApiResponse<StaffDto>>(`${STAFF_BASE}/${staffId}`);
};

export const registerStaffAPI = (request: StaffRegisterRequest) => {
  return api.post<ApiResponse<null>>(`${STAFF_BASE}/register`, request);
};

export type EmployeeStatus = "ACTIVE" | "LEAVE" | "RETIRED";

export type EmployeeSearchCriteria = "name" | "employeeId" | "department" | "phoneNumber";

export interface Employee {
  id: string;
  profileImage: string | null;
  name: string;
  birthDate: string;
  department: string;
  departmentId: string;
  email: string;
  phoneNumber: string;
  zipCode: string;
  baseAddress: string;
  detailAddress: string;
  licenseNumber: string;
  employeeId: string;
  position: string;
  status: EmployeeStatus;
  staffType: string;
  staffRankCode: string;
  staffPositionCode: string;
  staffRoleCode: string;
  staffExtensionNo: string;
  staffHireDate: string;
  staffAddress?: string;
  rawStaffStatus?: string;
}

export interface EmployeeRegisterForm {
  profileImage: string | null;
  employeeId: string;
  password: string;
  name: string;
  birthDate: string;
  departmentId: string;
  email: string;
  phoneNumber: string;
  zipCode: string;
  baseAddress: string;
  detailAddress: string;
  licenseNumber: string;
}

export interface StaffSearchParams {
  criteria: EmployeeSearchCriteria;
  keyword: string;
  jobRole: string;
  department: string;
}

export interface Status {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface AccountState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  searchParams: StaffSearchParams;
  listStatus: Status;
  detailStatus: Status;
  createStatus: Status;
  deleteStatus: Status;
}

export interface DepartmentDto {
  departmentId: string;
  departmentName: string;
  staffExtensionNo?: string;
}

export interface StaffDto {
  staffId: string;
  staffName: string;
  staffDepartmentId: string;
  staffDepartmentName?: string;
  staffRankCode: string;
  staffPhone: string;
  staffStatus: string;
  staffType?: string;
  staffRoleCode?: string;
  staffPositionCode?: string;
  staffExtensionNo?: string;
  staffEmail?: string;
  staffHireDate?: string;
  staffBirthDate?: string;
  staffLicenseNo?: string;
  staffAddress?: string;
}

export interface StaffListRequest {
  dept?: string;
  staffRankCode?: string;
  status?: string;
  keyword?: string;
  staffStatus?: string;
}

export interface StaffRegisterRequest {
  staffId: string;
  staffPassword: string;
  staffName: string;
  staffType: string;
  staffRoleCode?: string;
  staffDepartmentId: string;
  staffRankCode: string;
  staffPositionCode?: string;
  staffPhone: string;
  staffExtensionNo?: string;
  staffEmail?: string;
  staffHireDate: string;
  staffBirthDate: string;
  staffLicenseNo?: string;
  addressZipCode: string;
  addressBase: string;
  addressDetail?: string;
}

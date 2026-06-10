import type { EmployeeRegisterForm } from "./AccountTypes";

/** 신규 직원 등록 폼 드롭다운 — HOSPITAL.STAFF_DEPARTMENT 기준 */
export const DEPARTMENT_OPTIONS = [
  { value: "DEPT001", label: "내과", staffType: "DOC" },
  { value: "DEPT002", label: "외과", staffType: "DOC" },
  { value: "DEPT003", label: "소아과", staffType: "DOC" },
  { value: "DEPT004", label: "정형외과", staffType: "DOC" },
  { value: "DEPT005", label: "영상의학과", staffType: "DOC" },
  { value: "DEPT006", label: "간호부", staffType: "NUR" },
  { value: "DEPT007", label: "원무과", staffType: "ADM" },
  { value: "DEPT008", label: "응급의학과", staffType: "DOC" },
  { value: "DEPT009", label: "검사실", staffType: "ADM" },
  { value: "DEPT010", label: "행정팀", staffType: "ADM" },
];

export const STAFF_TYPE_OPTIONS = [
  { value: "DOCTOR", label: "의사" },
  { value: "DOC", label: "의사" },
  { value: "NURSE", label: "간호사" },
  { value: "NUR", label: "간호사" },
  { value: "ADMIN", label: "원무" },
  { value: "STAFF", label: "직원" },
  { value: "MANAGER", label: "관리자" },
];

export const RANK_LABEL: Record<string, string> = {
  RANK_CHIEF: "과장",
  RANK_SENIOR: "주임",
  RANK_STAFF: "사원",
  CHIEF: "과장",
  SENIOR: "주임",
  STAFF: "사원",
  과장: "과장",
  대리: "대리",
  주임: "주임",
  사원: "사원",
  원장: "원장",
};

export const POSITION_LABEL: Record<string, string> = {
  POS_HEAD: "과장",
  POS_LEAD: "주임",
  POS_MEMBER: "사원",
  과장: "과장",
  주임: "주임",
  사원: "사원",
  대리: "대리",
  원장: "원장",
};

export const SEARCH_CRITERIA_OPTIONS = [
  { value: "name", label: "이름" },
  { value: "employeeId", label: "사번" },
  { value: "department", label: "부서" },
  { value: "phoneNumber", label: "연락처" },
];

/** 부서별 내선번호 — API/DB 값이 없을 때 표시용 (백엔드 STAFF_DEPARTMENT 데이터가 있으면 그 값이 우선) */
export const DEPARTMENT_EXTENSION_BY_ID: Record<string, string> = {
  DEPT001: "2101",
  DEPT002: "2201",
  DEPT003: "2301",
  DEPT004: "2401",
  DEPT005: "2501",
  DEPT006: "2601",
  DEPT007: "2701",
  DEPT008: "2801",
  DEPT009: "2901",
  DEPT010: "3001",
};

export const DEFAULT_REGISTER_FORM: EmployeeRegisterForm = {
  profileImage: null,
  employeeId: "",
  password: "",
  name: "",
  birthDate: "",
  departmentId: "",
  email: "",
  phoneNumber: "",
  zipCode: "",
  baseAddress: "",
  detailAddress: "",
  licenseNumber: "",
};

export const STAFF_TYPE_LABEL: Record<string, string> = {
  DOCTOR: "의사",
  DOC: "의사",
  NURSE: "간호사",
  NUR: "간호사",
  ADMIN: "원무",
  STAFF: "직원",
  MANAGER: "관리자",
};

export const ROLE_LABEL: Record<string, string> = {
  ROLE_DOCTOR: "의사",
  ROLE_NURSE: "간호사",
  ROLE_ADMIN: "원무",
  ROLE_STAFF: "일반",
};

export const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "재직",
  LEAVE: "휴직",
  RETIRED: "퇴직",
  재직: "재직",
  휴직: "휴직",
  퇴직: "퇴직",
};

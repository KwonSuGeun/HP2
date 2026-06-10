import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  AccountState,
  Employee,
  EmployeeRegisterForm,
  StaffSearchParams,
  Status,
} from "./AccountTypes";

const initialStatus: Status = { loading: false, error: null, success: false };

const defaultSearchParams: StaffSearchParams = {
  criteria: "name",
  keyword: "",
  jobRole: "",
  department: "",
};

const initialState: AccountState = {
  employees: [],
  selectedEmployee: null,
  searchParams: defaultSearchParams,
  listStatus: { ...initialStatus },
  detailStatus: { ...initialStatus },
  createStatus: { ...initialStatus },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    // 전체조회
    fetchStaffListRequest: (state, action: PayloadAction<StaffSearchParams>) => {
      state.listStatus = { ...initialStatus, loading: true };
      state.searchParams = action.payload;
    },
    fetchStaffListSuccess: (state, action: PayloadAction<Employee[]>) => {
      state.listStatus = { ...initialStatus, loading: false };
      state.employees = action.payload;
    },
    fetchStaffListFailure: (state, action: PayloadAction<string>) => {
      state.listStatus = { ...initialStatus, loading: false, error: action.payload };
    },

    // 상세조회
    fetchStaffDetailRequest: (state, action: PayloadAction<string>) => {
      state.detailStatus = { ...initialStatus, loading: true };
      const fallback = state.employees.find((employee) => employee.employeeId === action.payload);
      if (fallback) {
        state.selectedEmployee = fallback;
      }
    },
    fetchStaffDetailSuccess: (state, action: PayloadAction<Employee>) => {
      state.detailStatus = { ...initialStatus, loading: false };
      state.selectedEmployee = action.payload;
    },
    fetchStaffDetailFailure: (state, action: PayloadAction<string>) => {
      state.detailStatus = { ...initialStatus, loading: false, error: action.payload };
    },
    clearSelectedEmployee: (state) => {
      state.selectedEmployee = null;
    },

    removeEmployeeFromList: (state, action: PayloadAction<string>) => {
      const staffId = action.payload;
      state.employees = state.employees.filter((employee) => employee.employeeId !== staffId);
      if (state.selectedEmployee?.employeeId === staffId) {
        state.selectedEmployee = null;
      }
    },

    // 등록
    registerStaffRequest: (
      state,
      action: PayloadAction<{ form: EmployeeRegisterForm; searchParams: StaffSearchParams }>,
    ) => {
      state.createStatus = { ...initialStatus, loading: true };
      state.searchParams = action.payload.searchParams;
    },
    registerStaffSuccess: (state) => {
      state.createStatus = { ...initialStatus, loading: false, success: true };
    },
    registerStaffFailure: (state, action: PayloadAction<string>) => {
      state.createStatus = { ...initialStatus, loading: false, error: action.payload };
    },

    resetStatus: (state, action: PayloadAction<keyof AccountState>) => {
      const key = action.payload;
      if (key.endsWith("Status")) {
        (state[key] as Status) = { loading: false, error: null, success: false };
      }
    },
  },
});

export const {
  fetchStaffListRequest,
  fetchStaffListSuccess,
  fetchStaffListFailure,
  fetchStaffDetailRequest,
  fetchStaffDetailSuccess,
  fetchStaffDetailFailure,
  clearSelectedEmployee,
  removeEmployeeFromList,
  registerStaffRequest,
  registerStaffSuccess,
  registerStaffFailure,
  resetStatus,
} = accountSlice.actions;

export default accountSlice.reducer;

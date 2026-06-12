import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  StaffState,
  Staff,
  StaffRegisterForm,
  StaffSearchParams,
  Status,
} from "./StaffTypes";

const initialStatus: Status = { loading: false, error: null, success: false };

const defaultSearchParams: StaffSearchParams = {
  criteria: "name",
  keyword: "",
  jobRole: "",
  department: "",
};

const initialState: StaffState = {
  staffList: [],
  selectedStaff: null,
  searchParams: defaultSearchParams,
  listStatus: { ...initialStatus },
  detailStatus: { ...initialStatus },
  createStatus: { ...initialStatus },
  deleteStatus: { ...initialStatus },
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    // 전체조회
    fetchStaffListRequest: (state, action: PayloadAction<StaffSearchParams>) => {
      state.listStatus = { ...initialStatus, loading: true };
      state.searchParams = action.payload;
    },
    fetchStaffListSuccess: (state, action: PayloadAction<Staff[]>) => {
      state.listStatus = { ...initialStatus, loading: false };
      state.staffList = action.payload;
    },
    fetchStaffListFailure: (state, action: PayloadAction<string>) => {
      state.listStatus = { ...initialStatus, loading: false, error: action.payload };
    },

    // 상세조회
    fetchStaffDetailRequest: (state, action: PayloadAction<string>) => {
      state.detailStatus = { ...initialStatus, loading: true };
      const fallback = state.staffList.find((staff) => staff.staffId === action.payload);
      if (fallback) {
        state.selectedStaff = fallback;
      }
    },
    fetchStaffDetailSuccess: (state, action: PayloadAction<Staff>) => {
      state.detailStatus = { ...initialStatus, loading: false };
      state.selectedStaff = action.payload;
    },
    fetchStaffDetailFailure: (state, action: PayloadAction<string>) => {
      state.detailStatus = { ...initialStatus, loading: false, error: action.payload };
    },
    clearSelectedStaff: (state) => {
      state.selectedStaff = null;
    },

    // 삭제
    deleteStaffRequest: (
      state,
      action: PayloadAction<{ staffId: string; searchParams: StaffSearchParams }>,
    ) => {
      state.deleteStatus = { ...initialStatus, loading: true };
      state.searchParams = action.payload.searchParams;
    },
    deleteStaffSuccess: (state) => {
      state.deleteStatus = { ...initialStatus, loading: false, success: true };
      state.selectedStaff = null;
    },
    deleteStaffFailure: (state, action: PayloadAction<string>) => {
      state.deleteStatus = { ...initialStatus, loading: false, error: action.payload };
    },

    // 등록
    registerStaffRequest: (
      state,
      action: PayloadAction<{ form: StaffRegisterForm; searchParams: StaffSearchParams }>,
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

    resetStatus: (state, action: PayloadAction<keyof StaffState>) => {
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
  clearSelectedStaff,
  deleteStaffRequest,
  deleteStaffSuccess,
  deleteStaffFailure,
  registerStaffRequest,
  registerStaffSuccess,
  registerStaffFailure,
  resetStatus,
} = staffSlice.actions;

export default staffSlice.reducer;

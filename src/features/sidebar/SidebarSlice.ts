import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SidebarItem } from "./SidebarTypes";

/** 사이드바 메뉴 목록 및 로딩/에러 상태 */
type SidebarState = {
  items: SidebarItem[];
  loading: boolean;
  error: string | null;
};

const initialState: SidebarState = {
  items: [],
  loading: false,
  error: null,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    /** Sidebar 마운트 시 saga 트리거 */
    fetchSidebarRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSidebarSuccess(state, action: PayloadAction<SidebarItem[]>) {
      state.loading = false;
      state.items = action.payload;
    },
    fetchSidebarFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchSidebarRequest,
  fetchSidebarSuccess,
  fetchSidebarFailure,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;

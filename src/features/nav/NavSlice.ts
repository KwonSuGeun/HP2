import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { NavUser } from "./NavTypes";

/** Nav 상단바 사용자 상태 */
type NavState = {
  user: NavUser | null;
};

/** 로그인 API 연동 전까지 Nav에 표시할 임시 계정 */
const mockUser: NavUser = {
  loginId: "hospital",
  name: "권수근",
  department: "원무과",
  role: "ADMIN",
};

const initialState: NavState = {
  user: mockUser,
};

const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<NavUser | null>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { setUser, logout } = navSlice.actions;

export default navSlice.reducer;

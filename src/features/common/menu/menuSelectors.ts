import type { RootState } from "@/store/rootReducer";

export const selectCommonMenuItems = (state: RootState) => state.commonMenu.items;
export const selectCommonMenuLoading = (state: RootState) => state.commonMenu.loading;
export const selectCommonMenuError = (state: RootState) => state.commonMenu.error;

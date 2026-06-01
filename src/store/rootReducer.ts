import { combineReducers } from "@reduxjs/toolkit";
import commonMenuReducer from "@/features/common/menu/menuReducer";
const rootReducer = combineReducers({
  commonMenu: commonMenuReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

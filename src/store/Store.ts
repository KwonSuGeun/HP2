import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import navReducer from "@/features/nav/NavSlice";
import sidebarReducer from "@/features/sidebar/SidebarSlice";
import rootSaga from "./RootSaga";

/** Redux-Saga 미들웨어 (비동기 API 호출용, thunk 비활성) */
const sagaMiddleware = createSagaMiddleware();

/** 앱 전역 Redux store — nav(상단바), sidebar(메뉴) 슬라이스 포함 */
export const store = configureStore({
  reducer: {
    nav: navReducer,
    sidebar: sidebarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

/** useSelector 타입 추론용 전역 상태 타입 */
export type RootState = {
  nav: ReturnType<typeof navReducer>;
  sidebar: ReturnType<typeof sidebarReducer>;
};

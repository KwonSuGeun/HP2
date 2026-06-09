import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import accountReducer from "@/features/accounts/AccountSlice";
import navReducer from "@/features/nav/NavSlice";
import sidebarReducer from "@/features/sidebar/SidebarSlice";
import rootSaga from "./RootSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    nav: navReducer,
    sidebar: sidebarReducer,
    account: accountReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

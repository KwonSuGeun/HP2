import { all, fork } from "redux-saga/effects";
import { watchAccountSaga } from "@/features/accounts/AccountSaga";
import { watchSidebarSaga } from "@/features/sidebar/SidebarSaga";

export default function* rootSaga() {
  yield all([fork(watchSidebarSaga), fork(watchAccountSaga)]);
}

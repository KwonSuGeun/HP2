import { all, fork } from "redux-saga/effects";
import { watchStaffSaga } from "@/features/staff/StaffSaga";
import { watchSidebarSaga } from "@/features/sidebar/SidebarSaga";

export default function* rootSaga() {
  yield all([fork(watchSidebarSaga), fork(watchStaffSaga)]);
}

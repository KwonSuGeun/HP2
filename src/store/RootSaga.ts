import { all, fork } from "redux-saga/effects";
import { watchSidebarSaga } from "@/features/sidebar/SidebarSaga";

/** feature별 saga를 fork로 병렬 등록 */
export default function* rootSaga() {
  yield all([fork(watchSidebarSaga)]);
}

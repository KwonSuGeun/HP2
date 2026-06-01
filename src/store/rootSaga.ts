import { all, fork } from "redux-saga/effects";
import { watchCommonMenuSaga } from "@/features/common/menu/menuSaga";
export default function* rootSaga() {
  yield all([
    fork(watchCommonMenuSaga),
  ]);
}

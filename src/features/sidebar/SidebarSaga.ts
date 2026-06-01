import { call, put, takeLatest } from "redux-saga/effects";
import { fetchSidebarApi } from "@/lib/api/SidebarApi";
import {
  fetchSidebarRequest,
  fetchSidebarSuccess,
  fetchSidebarFailure,
} from "./SidebarSlice";
import type { SidebarItem } from "./SidebarTypes";

/** fetchSidebarRequest 액션 → API 호출 → success/failure dispatch */
function* fetchSidebarSaga() {
  try {
    const items: SidebarItem[] = yield call(fetchSidebarApi);
    yield put(fetchSidebarSuccess(items));
  } catch {
    yield put(fetchSidebarFailure("사이드바 로드 실패"));
  }
}

/** 중복 요청 시 마지막 요청만 처리 (takeLatest) */
export function* watchSidebarSaga() {
  yield takeLatest(fetchSidebarRequest.type, fetchSidebarSaga);
}

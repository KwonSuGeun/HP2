import { call, put, takeLatest } from "redux-saga/effects";
import { fetchSidebarApi } from "@/lib/api/SidebarApi";
import { FALLBACK_SIDEBAR_ITEMS } from "./fallbackSidebarItems";
import {
  fetchSidebarRequest,
  fetchSidebarSuccess,
} from "./SidebarSlice";
import type { SidebarItem } from "./SidebarTypes";

function* fetchSidebarSaga() {
  try {
    const items: SidebarItem[] = yield call(fetchSidebarApi);
    yield put(fetchSidebarSuccess(items.length > 0 ? items : FALLBACK_SIDEBAR_ITEMS));
  } catch {
    yield put(fetchSidebarSuccess(FALLBACK_SIDEBAR_ITEMS));
  }
}

export function* watchSidebarSaga() {
  yield takeLatest(fetchSidebarRequest.type, fetchSidebarSaga);
}

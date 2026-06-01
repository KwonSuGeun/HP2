import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import type { ApiResponse, MenuDto } from "@/types/commonDomain";
import {
  FETCH_COMMON_MENUS_REQUEST,
  fetchCommonMenusFailure,
  fetchCommonMenusSuccess,
  type FetchCommonMenusRequestAction,
} from "./menuActions";
import { fetchCommonMenusApi } from "./menuApi";

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError(error)) {
    const apiMessage = (error.response?.data as { message?: string } | undefined)?.message;
    return apiMessage || fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};

function* fetchCommonMenusWorker(action: FetchCommonMenusRequestAction) {
  try {
    const response: ApiResponse<MenuDto[]> = yield call(fetchCommonMenusApi, action.payload);
    yield put(fetchCommonMenusSuccess(response.data));
  } catch (error) {
    yield put(fetchCommonMenusFailure(getErrorMessage(error, "메뉴 목록 조회에 실패했습니다.")));
  }
}

export function* watchCommonMenuSaga() {
  yield takeLatest(FETCH_COMMON_MENUS_REQUEST, fetchCommonMenusWorker);
}

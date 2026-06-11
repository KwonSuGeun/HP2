import { all, call, put, takeLatest } from "redux-saga/effects";
import axios, { AxiosResponse } from "axios";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  deleteStaffAPI,
  fetchDepartmentListAPI,
  fetchStaffDetailAPI,
  fetchStaffListAPI,
  registerStaffAPI,
} from "./api";
import {
  deleteStaffFailure,
  deleteStaffRequest,
  deleteStaffSuccess,
  fetchStaffDetailFailure,
  fetchStaffDetailRequest,
  fetchStaffDetailSuccess,
  fetchStaffListFailure,
  fetchStaffListRequest,
  fetchStaffListSuccess,
  registerStaffFailure,
  registerStaffRequest,
  registerStaffSuccess,
} from "./AccountSlice";
import type { ApiResponse } from "@/lib/api/types/ApiResponse";
import type { DepartmentDto, EmployeeRegisterForm, StaffDto } from "./AccountTypes";
import { formToStaffRegisterRequest } from "./employeeUtils";
import { staffDtoToEmployee } from "./staffMapper";
import { setDepartmentExtensionMap, writeStaffDetailCache, removeStaffDetailCache } from "./staffEnrichment";
import {
  applyClientFilters,
  buildStaffListRequest,
  StaffSearchParams,
} from "./staffSearchUtils";

function getErrorMessage(e: unknown, defaultMsg: string) {
  if (axios.isAxiosError(e)) {
    const message = (e.response?.data as ApiResponse<unknown> | undefined)?.message;
    return message || defaultMsg;
  }
  return (e as Error)?.message || defaultMsg;
}

function assertApiSuccess<T>(response: ApiResponse<T>): T {
  if (String(response.code) !== "200") {
    throw new Error(response.message || "요청 처리에 실패했습니다.");
  }
  return response.data;
}

function* loadDepartmentExtensionMap() {
  try {
    const response: AxiosResponse<ApiResponse<DepartmentDto[]>> = yield call(fetchDepartmentListAPI);
    const payload = response.data;
    if (String(payload?.code) === "200" && Array.isArray(payload.data)) {
      const map = Object.fromEntries(
        payload.data
          .filter((department) => department.departmentId && department.staffExtensionNo?.trim())
          .map((department) => [department.departmentId, department.staffExtensionNo!.trim()]),
      );
      setDepartmentExtensionMap(map);
      return;
    }
  } catch {
    // ignore
  }
  setDepartmentExtensionMap({});
}

function* fetchStaffListSaga(action: PayloadAction<StaffSearchParams>) {
  try {
    yield call(loadDepartmentExtensionMap);
    const request = buildStaffListRequest(action.payload);
    const response: AxiosResponse<ApiResponse<StaffDto[]>> = yield call(fetchStaffListAPI, request);
    const list = assertApiSuccess(response.data) ?? [];
    const employees = applyClientFilters(
      list.map((dto) => staffDtoToEmployee(dto)),
      action.payload,
    );
    yield put(fetchStaffListSuccess(employees));
  } catch (e) {
    yield put(fetchStaffListFailure(getErrorMessage(e, "직원 목록을 불러오지 못했습니다.")));
  }
}

function* fetchStaffDetailSaga(action: PayloadAction<string>) {
  try {
    yield call(loadDepartmentExtensionMap);
    const response: AxiosResponse<ApiResponse<StaffDto>> = yield call(
      fetchStaffDetailAPI,
      action.payload,
    );
    yield put(fetchStaffDetailSuccess(staffDtoToEmployee(assertApiSuccess(response.data), { useCache: true })));
  } catch (e) {
    yield put(fetchStaffDetailFailure(getErrorMessage(e, "직원 상세 정보를 불러오지 못했습니다.")));
  }
}

function* registerStaffSaga(
  action: PayloadAction<{ form: EmployeeRegisterForm; searchParams: StaffSearchParams }>,
) {
  try {
    const request = formToStaffRegisterRequest(action.payload.form);
    const response: AxiosResponse<ApiResponse<null>> = yield call(registerStaffAPI, request);
    assertApiSuccess(response.data);
    writeStaffDetailCache(action.payload.form.employeeId.trim(), action.payload.form);
    yield put(registerStaffSuccess());
    yield put(fetchStaffListRequest(action.payload.searchParams));
  } catch (e) {
    yield put(
      registerStaffFailure(getErrorMessage(e, "직원 등록에 실패했습니다. 입력값을 확인해 주세요.")),
    );
  }
}

function* deleteStaffSaga(
  action: PayloadAction<{ staffId: string; searchParams: StaffSearchParams }>,
) {
  try {
    const { staffId, searchParams } = action.payload;
    const response: AxiosResponse<ApiResponse<null>> = yield call(deleteStaffAPI, staffId);
    assertApiSuccess(response.data);
    removeStaffDetailCache(staffId);
    yield put(deleteStaffSuccess());
    yield put(fetchStaffListRequest(searchParams));
  } catch (e) {
    yield put(deleteStaffFailure(getErrorMessage(e, "직원 삭제에 실패했습니다.")));
  }
}

export function* watchAccountSaga() {
  yield all([
    takeLatest(fetchStaffListRequest.type, fetchStaffListSaga),
    takeLatest(fetchStaffDetailRequest.type, fetchStaffDetailSaga),
    takeLatest(registerStaffRequest.type, registerStaffSaga),
    takeLatest(deleteStaffRequest.type, deleteStaffSaga),
  ]);
}

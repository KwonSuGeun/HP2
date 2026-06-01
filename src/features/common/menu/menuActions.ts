import type { FetchMenusRequest, MenuDto } from "@/types/commonDomain";

export const FETCH_COMMON_MENUS_REQUEST = "common/menu/FETCH_COMMON_MENUS_REQUEST" as const;
export const FETCH_COMMON_MENUS_SUCCESS = "common/menu/FETCH_COMMON_MENUS_SUCCESS" as const;
export const FETCH_COMMON_MENUS_FAILURE = "common/menu/FETCH_COMMON_MENUS_FAILURE" as const;

export interface FetchCommonMenusRequestAction {
  type: typeof FETCH_COMMON_MENUS_REQUEST;
  payload: FetchMenusRequest;
}

export interface FetchCommonMenusSuccessAction {
  type: typeof FETCH_COMMON_MENUS_SUCCESS;
  payload: MenuDto[];
}

export interface FetchCommonMenusFailureAction {
  type: typeof FETCH_COMMON_MENUS_FAILURE;
  payload: string;
}

export type CommonMenuAction =
  | FetchCommonMenusRequestAction
  | FetchCommonMenusSuccessAction
  | FetchCommonMenusFailureAction;

export const fetchCommonMenusRequest = (
  payload: FetchMenusRequest
): FetchCommonMenusRequestAction => ({
  type: FETCH_COMMON_MENUS_REQUEST,
  payload,
});

export const fetchCommonMenusSuccess = (payload: MenuDto[]): FetchCommonMenusSuccessAction => ({
  type: FETCH_COMMON_MENUS_SUCCESS,
  payload,
});

export const fetchCommonMenusFailure = (payload: string): FetchCommonMenusFailureAction => ({
  type: FETCH_COMMON_MENUS_FAILURE,
  payload,
});

import type { CommonMenuState } from "@/types/commonDomain";
import {
  FETCH_COMMON_MENUS_FAILURE,
  FETCH_COMMON_MENUS_REQUEST,
  FETCH_COMMON_MENUS_SUCCESS,
  type CommonMenuAction,
} from "./menuActions";

const initialState: CommonMenuState = {
  items: [],
  loading: false,
  error: null,
};

export default function commonMenuReducer(
  state: CommonMenuState = initialState,
  action: CommonMenuAction
): CommonMenuState {
  switch (action.type) {
    case FETCH_COMMON_MENUS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_COMMON_MENUS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
        error: null,
      };
    case FETCH_COMMON_MENUS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}

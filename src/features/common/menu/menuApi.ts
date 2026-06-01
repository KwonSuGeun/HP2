import api from "@/lib/axios";
import type { ApiResponse, FetchMenusRequest, MenuDto } from "@/types/commonDomain";

export const fetchCommonMenusApi = (payload: FetchMenusRequest) =>
  api
    .get<ApiResponse<MenuDto[]>>("/common/menus", {
      params: {
        userId: payload.userId,
        includeInactive: payload.includeInactive ? "Y" : "N",
      },
    })
    .then((response) => response.data);

import axios, { AxiosError } from "axios";
import type { ApiResponse } from "@/types/commonDomain";

const baseURL = process.env.NEXT_PUBLIC_COMMON_API_BASE_URL?.trim() || "http://localhost:9595";

const api = axios.create({
  baseURL,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<null>>) => {
    const message = error.response?.data?.message || "서버 통신 중 오류가 발생했습니다.";
    return Promise.reject(new Error(message));
  }
);

export default api;

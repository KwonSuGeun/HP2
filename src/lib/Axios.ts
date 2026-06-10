import axios from "axios";

const apiBase = process.env.NEXT_PUBLIC_API_URL?.trim();

export const api = axios.create({
  /** 비어 있으면 Next.js /api/* 프록시(상대 경로), 값이 있으면 백엔드 직접 호출 */
  baseURL: apiBase || "",
});

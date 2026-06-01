import axios from "axios";

/** Spring Boot 백엔드 Axios 인스턴스 — baseURL은 .env.local의 NEXT_PUBLIC_API_URL */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081",
});

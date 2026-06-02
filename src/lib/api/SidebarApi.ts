import { api } from "@/lib/Axios";
import type { SidebarItem } from "@/features/sidebar/SidebarTypes";

/** GET /api/menus — 백엔드에서 계층형 사이드바 메뉴 조회 */
export async function fetchSidebarApi(): Promise<SidebarItem[]> {
  const response = await api.get<SidebarItem[]>("/api/menus");
  return response.data;
}

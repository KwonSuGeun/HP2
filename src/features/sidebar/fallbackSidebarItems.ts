import type { SidebarItem } from "./SidebarTypes";

/** API 미연결 시 개발용 사이드바 폴백 (관리 → 계정관리 포함) */
export const FALLBACK_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: 1,
    code: "HOME",
    name: "홈",
    path: "/",
    icon: "Home",
    children: [],
  },
  {
    id: 50,
    code: "ADMIN",
    name: "관리",
    path: null,
    icon: "Policy",
    children: [
      {
        id: 51,
        code: "ADMIN_ACCOUNT",
        name: "계정관리",
        path: "/admin/account-management",
        icon: null,
        children: [],
      },
      {
        id: 52,
        code: "ADMIN_MENU_MANAGE",
        name: "메뉴 관리",
        path: "/admin/permissions/menu",
        icon: null,
        children: [],
      },
      {
        id: 53,
        code: "ADMIN_ROLE_MENU",
        name: "권한 관리",
        path: "/admin/permissions/role-menu",
        icon: null,
        children: [],
      },
    ],
  },
  {
    id: 30,
    code: "STAFF",
    name: "직원",
    path: null,
    icon: "PersonAdd",
    children: [
      {
        id: 31,
        code: "STAFF_LIST",
        name: "직원 목록",
        path: "/staff",
        icon: null,
        children: [],
      },
    ],
  },
];

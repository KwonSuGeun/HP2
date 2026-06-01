import type { MenuNode } from "@/types/menu";
import type { MenuDto } from "@/types/commonDomain";

export const toSidebarMenuNodes = (menus: MenuDto[]): MenuNode[] =>
  menus.map((menu) => ({
    id: menu.menuId,
    parentId: menu.parentMenuId,
    code: menu.code,
    name: menu.name,
    nameEn: menu.nameEn ?? null,
    path: menu.path,
    icon: menu.icon,
    sortOrder: menu.sortOrder,
    isActive: "Y",
    adminOnly: "N",
    children: toSidebarMenuNodes(menu.children ?? []),
  }));

import type { SidebarItem } from "@/features/sidebar/SidebarTypes";

/** 현재 URL과 항목 path가 같은지 확인 */
export function isItemActive(
  pathname: string,
  path: string | null | undefined,
  hasChildren: boolean,
): boolean {
  if (!path) return false;
  if (pathname === path) return true;
  if (hasChildren && pathname.startsWith(`${path}/`)) return true;
  return false;
}

/** 자식 중에 현재 페이지에 해당하는 항목이 있는지 */
export function hasActiveChild(pathname: string, item: SidebarItem): boolean {
  if (!item.children?.length) return false;

  return item.children.some(
    (child) =>
      isItemActive(pathname, child.path, !!child.children?.length) ||
      hasActiveChild(pathname, child),
  );
}

/** 현재 페이지 때문에 펼쳐야 할 부모 id 목록 */
export function getOpenIds(pathname: string, items: SidebarItem[]): number[] {
  const openIds: number[] = [];

  for (const item of items) {
    if (item.children?.length && hasActiveChild(pathname, item)) {
      openIds.push(item.id);
    }
    if (item.children?.length) {
      openIds.push(...getOpenIds(pathname, item.children));
    }
  }

  return openIds;
}

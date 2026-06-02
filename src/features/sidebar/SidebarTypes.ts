/** 백엔드 MenuNodeDto와 1:1 대응하는 사이드바 메뉴 타입 */
export type SidebarItem = {
  id: number;
  code: string;
  name: string;
  path: string | null;
  icon: string | null;
  children: SidebarItem[];
};

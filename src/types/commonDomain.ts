export type Yn = "Y" | "N";

export interface UserEntity {
  userId: number;
  userCode: string;
  userName: string;
  email: string | null;
  useYn: Yn;
  createdAt: string;
  updatedAt: string;
}

export interface RoleEntity {
  roleId: number;
  roleCode: string;
  roleName: string;
  roleNameEn: string | null;
  roleDesc: string | null;
  roleDescEn: string | null;
  useYn: Yn;
  createdAt: string;
  updatedAt: string;
}

export interface UserRoleEntity {
  userRoleId: number;
  userId: number;
  roleId: number;
  assignedAt: string;
  assignedBy: string | null;
}

export interface MenuEntity {
  menuId: number;
  parentMenuId: number | null;
  menuCode: string;
  menuName: string;
  menuPath: string | null;
  menuIcon: string | null;
  sortOrder: number;
  depthLevel: number;
  useYn: Yn;
  createdAt: string;
  updatedAt: string;
}

export interface MenuRoleEntity {
  menuRoleId: number;
  menuId: number;
  roleId: number;
  permitReadYn: Yn;
  permitWriteYn: Yn;
  permitDeleteYn: Yn;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
  timestamp: string;
}

export interface FetchMenusRequest {
  userId: number;
  includeInactive?: boolean;
}

export interface MenuDto {
  menuId: number;
  parentMenuId: number | null;
  code: string;
  name: string;
  nameEn?: string | null;
  path: string | null;
  icon: string | null;
  sortOrder: number;
  children: MenuDto[];
}

export interface CommonMenuState {
  items: MenuDto[];
  loading: boolean;
  error: string | null;
}

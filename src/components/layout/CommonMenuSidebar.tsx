"use client";

import * as React from "react";
import Sidebar from "@/components/layout/Sidebar";
import { fetchCommonMenusRequest } from "@/features/common/menu/menuActions";
import {
  selectCommonMenuError,
  selectCommonMenuItems,
  selectCommonMenuLoading,
} from "@/features/common/menu/menuSelectors";
import { toSidebarMenuNodes } from "@/features/common/menu/menuMapper";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

type CommonMenuSidebarProps = {
  userId: number;
  width?: number;
  locale?: "ko" | "en";
};

export default function CommonMenuSidebar({
  userId,
  width = 240,
  locale = "ko",
}: CommonMenuSidebarProps) {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCommonMenuItems);
  const loading = useAppSelector(selectCommonMenuLoading);
  const error = useAppSelector(selectCommonMenuError);

  React.useEffect(() => {
    dispatch(fetchCommonMenusRequest({ userId }));
  }, [dispatch, userId]);

  const menus = React.useMemo(() => toSidebarMenuNodes(items), [items]);

  return (
    <Sidebar
      menus={menus}
      width={width}
      loading={loading}
      menuLoadError={Boolean(error)}
      locale={locale}
    />
  );
}

"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchSidebarRequest } from "@/features/sidebar/SidebarSlice";
import type { RootState } from "@/store/Store";
import { getOpenIds } from "./SidebarUtils";
import SidebarItem from "./SidebarItem";
import styles from "./Sidebar.module.css";

type SidebarProps = {
  width?: number;
};

export default function Sidebar({ width = 240 }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state: RootState) => state.sidebar);

  const [openIds, setOpenIds] = React.useState<number[]>([]);

  React.useEffect(() => {
    dispatch(fetchSidebarRequest());
  }, [dispatch]);

  const autoOpenIds = React.useMemo(
    () => (items.length ? getOpenIds(pathname, items) : []),
    [pathname, items],
  );
  const autoOpenKey = `${pathname}:${autoOpenIds.join(",")}`;
  const [prevAutoOpenKey, setPrevAutoOpenKey] = React.useState(autoOpenKey);
  if (autoOpenKey !== prevAutoOpenKey) {
    setPrevAutoOpenKey(autoOpenKey);
    if (autoOpenIds.length > 0) {
      setOpenIds((prev) => [...new Set([...prev, ...autoOpenIds])]);
    }
  }

  const toggleItem = (id: number) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]));
  };

  return (
    <aside className={styles.sidebarRoot} style={{ width }}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>병원 운영 메뉴</h2>
      </div>

      <div className={styles.sidebarListArea}>
        {loading ? (
          <div className={styles.sidebarLoading}>
            <div className={styles.spinner} aria-label="로딩 중" />
          </div>
        ) : error ? (
          <div className={styles.sidebarMessage}>
            <p className={styles.sidebarMessageText}>{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className={styles.sidebarMessage}>
            <p className={styles.sidebarMessageText}>표시할 메뉴가 없습니다.</p>
          </div>
        ) : (
          <ul className={styles.menuList}>
            {items.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                pathname={pathname}
                openIds={openIds}
                onToggle={toggleItem}
              />
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

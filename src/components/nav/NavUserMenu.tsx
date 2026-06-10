"use client";

import * as React from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/features/nav/NavSlice";
import type { RootState } from "@/store/Store";
import styles from "./NavUserMenu.module.css";

export default function NavUserMenu() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.nav.user);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  if (!user) {
    return (
      <Link href="/login" className={styles.loginButton}>
        로그인
      </Link>
    );
  }

  const handleLogout = () => {
    setMenuOpen(false);
    dispatch(logout());
  };

  return (
    <div className={styles.menuWrap} ref={menuRef}>
      <button type="button" className={styles.userTrigger} onClick={() => setMenuOpen((prev) => !prev)}>
        <span className={styles.userAvatar}>{user.name.charAt(0)}</span>
        <div className={styles.userSummary}>
          <p className={styles.userName}>{user.name}</p>
          <p className={styles.userMeta}>
            {user.department} · {user.loginId}
          </p>
        </div>
        <span className={styles.expandIcon} aria-hidden="true">
          ▾
        </span>
      </button>

      {menuOpen ? (
        <div className={styles.userMenu} role="menu">
          <div className={styles.userMenuHeader}>
            <p className={styles.userMenuName}>{user.name}</p>
            <p className={styles.userMenuDetail}>{user.department}</p>
            <p className={styles.userMenuDetail}>아이디: {user.loginId}</p>
            <p className={styles.userMenuDetail}>권한: {user.role}</p>
          </div>
          <hr className={styles.menuDivider} />
          <button type="button" className={styles.menuItem} disabled role="menuitem">
            <span className={styles.menuItemIcon} aria-hidden="true">
              👤
            </span>
            내 정보 (준비 중)
          </button>
          <button type="button" className={styles.menuItem} onClick={handleLogout} role="menuitem">
            <span className={styles.menuItemIcon} aria-hidden="true">
              ⎋
            </span>
            로그아웃
          </button>
        </div>
      ) : null}
    </div>
  );
}

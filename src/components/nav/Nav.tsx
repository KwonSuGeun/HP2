"use client";

import Link from "next/link";
import NavUserMenu from "./NavUserMenu";
import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <header className={styles.navBar}>
      <div className={styles.navToolbar}>
        <Link href="/" className={styles.brandLink}>
          <span className={styles.brandIcon} aria-hidden="true">
            🏥
          </span>
          <div className={styles.brandText}>
            <p className={styles.brandTitle}>Hospital CORE</p>
            <p className={styles.brandSubtitle}>병원 운영 시스템</p>
          </div>
        </Link>

        <div className={styles.navSpacer} />

        <NavUserMenu />
      </div>
    </header>
  );
}

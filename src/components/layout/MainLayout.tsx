import Nav from "@/components/nav/Nav";
import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./MainLayout.module.css";

export const SIDEBAR_WIDTH = 240;

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={styles.layoutRoot}
      style={{ ["--sidebar-width" as string]: `${SIDEBAR_WIDTH}px` }}
    >
      <div className={styles.sidebarWrap}>
        <Sidebar width={SIDEBAR_WIDTH} />
      </div>
      <div className={styles.contentWrap}>
        <Nav />
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
}

import Providers from "./Providers";
import MainLayout from "@/components/layout/MainLayout";
import "./globals.css";

/** Next.js App Router 루트 레이아웃 — Providers + 고정 Sidebar/Nav 셸 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}

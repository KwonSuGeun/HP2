import type { SxProps, Theme } from "@mui/material";

/** 사이드바 고정 너비(px) — md 이상에서 contentWrap ml과 동기화 */
export const SIDEBAR_WIDTH = 240;

/** 전체 페이지 배경 그라데이션 */
export const layoutRootSx: SxProps<Theme> = {
  minHeight: "100vh",
  overflowX: "hidden",
  backgroundImage: [
    "radial-gradient(circle at 12% 8%, rgba(11, 91, 143, 0.18) 0%, rgba(11, 91, 143, 0) 38%)",
    "radial-gradient(circle at 88% 12%, rgba(217, 119, 6, 0.16) 0%, rgba(217, 119, 6, 0) 32%)",
    "linear-gradient(180deg, #eef3f7 0%, #f7fafc 55%, #eef2f7 100%)",
  ].join(", "),
  backgroundAttachment: "fixed",
};

/** md 이상: 좌측 고정 사이드바 영역 */
export const sidebarWrapSx = (sidebarWidth: number): SxProps<Theme> => ({
  position: { xs: "static", md: "fixed" },
  top: 0,
  left: 0,
  width: { xs: "100%", md: `${sidebarWidth}px` },
  height: { xs: "auto", md: "100vh" },
  overflowY: { md: "auto" },
  zIndex: 1100,
});

/** 사이드바 너비만큼 왼쪽 여백을 두는 메인 콘텐츠 영역 */
export const contentWrapSx = (sidebarWidth: number): SxProps<Theme> => ({
  ml: { xs: 0, md: `${sidebarWidth}px` },
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
});

export const mainContentSx: SxProps<Theme> = {
  flex: 1,
  px: { xs: 2, md: 4 },
  py: 3,
};

"use client";

import { Typography } from "@mui/material";

/** 메인(/) 페이지 — 사이드바 고정 레이아웃 안의 기본 콘텐츠 */
export default function HomePage() {
  return (
    <>
      <Typography sx={{ fontWeight: 800, fontSize: 22, color: "var(--brand-strong)" }}>
        Hospital
      </Typography>
      <Typography sx={{ mt: 1, color: "var(--muted)" }}>
        왼쪽 메뉴에서 이동하세요. 사이드바는 페이지 이동 시 고정됩니다.
      </Typography>
    </>
  );
}

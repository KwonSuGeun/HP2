"use client";

import { Box } from "@mui/material";
import Nav from "@/components/nav/Nav";
import Sidebar from "@/components/sidebar/Sidebar";
import {
  contentWrapSx,
  layoutRootSx,
  mainContentSx,
  SIDEBAR_WIDTH,
  sidebarWrapSx,
} from "./MainLayoutStyles";

/** 좌측 Sidebar + 우측(Nav + 페이지 콘텐츠) 2단 레이아웃 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={layoutRootSx}>
      <Box sx={sidebarWrapSx(SIDEBAR_WIDTH)}>
        <Sidebar width={SIDEBAR_WIDTH} />
      </Box>
      <Box sx={contentWrapSx(SIDEBAR_WIDTH)}>
        <Nav />
        <Box component="main" sx={mainContentSx}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

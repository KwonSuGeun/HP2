"use client";

import { createTheme } from "@mui/material/styles";

export const hisTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0b5b8f",
      dark: "#07476f",
      light: "#3d8fc4",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#1a3a5c",
      light: "#4a6a8a",
    },
    background: {
      default: "#eef4fb",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a2b3c",
      secondary: "#5c6f82",
    },
    divider: "rgba(15, 40, 80, 0.10)",
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily:
      '"Pretendard Variable", "Pretendard", "Segoe UI", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
    h5: { fontWeight: 800, letterSpacing: "-0.02em" },
    h6: { fontWeight: 700 },
    button: { fontWeight: 700, textTransform: "none" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "transparent",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },
  },
});

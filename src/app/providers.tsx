"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { LocaleProvider } from "@/context/LocaleContext";
import { hisTheme } from "@/theme/hisTheme";
import { store } from "@/store/store";

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={hisTheme}>
        <CssBaseline />
        <LocaleProvider>{children}</LocaleProvider>
      </ThemeProvider>
    </Provider>
  );
}

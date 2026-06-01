"use client";

import { Box, Divider, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useLocale } from "@/context/LocaleContext";
import { hisColors } from "@/theme/hisColors";

export default function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        px: 0.5,
        py: 0.5,
        borderRadius: 2.5,
        border: `1.5px solid ${hisColors.navySoft}`,
        backgroundColor: hisColors.surface,
        boxShadow: hisColors.shadowSm,
      }}
    >
      <ToggleButtonGroup
        value={locale}
        exclusive
        onChange={(_, value: "ko" | "en" | null) => {
          if (value) {
            setLocale(value);
          }
        }}
        size="small"
        sx={{
          gap: 0.5,
          "& .MuiToggleButtonGroup-grouped": {
            border: 0,
            borderRadius: 1.5,
          },
        }}
      >
        <ToggleButton
          value="ko"
          aria-label="Korean"
          sx={{
            px: 1.6,
            minWidth: 46,
            fontWeight: 800,
            color: locale === "ko" ? "#ffffff" : hisColors.muted,
            backgroundColor: locale === "ko" ? `${hisColors.navySoft} !important` : "transparent",
          }}
        >
          KO
        </ToggleButton>
        <Divider orientation="vertical" flexItem sx={{ alignSelf: "stretch", borderColor: "#d1d5db" }} />
        <ToggleButton
          value="en"
          aria-label="English"
          sx={{
            px: 1.6,
            minWidth: 46,
            fontWeight: 800,
            color: locale === "en" ? "#ffffff" : hisColors.muted,
            backgroundColor: locale === "en" ? `${hisColors.navySoft} !important` : "transparent",
          }}
        >
          EN
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

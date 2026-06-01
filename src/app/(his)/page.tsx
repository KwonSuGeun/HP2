"use client";

import { Box, Grid, Typography } from "@mui/material";
import { useLocale } from "@/context/LocaleContext";
import { hisColors } from "@/theme/hisColors";

const highlights = [
  { ko: "접수", en: "Reception" },
  { ko: "진료", en: "Clinical" },
  { ko: "진료지원", en: "Clinical Support" },
  { ko: "환자 · 직원 · 수납", en: "Patient · Staff · Billing" },
];

export default function HomePage() {
  const { locale } = useLocale();

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 800, letterSpacing: "-0.03em", color: hisColors.navy, mb: 1 }}
      >
        {locale === "ko" ? "HIS 공통 도메인" : "HIS Common Domain"}
      </Typography>
      <Typography sx={{ color: hisColors.muted, maxWidth: 640, lineHeight: 1.7, mb: 3 }}>
        {locale === "ko"
          ? "메뉴·권한·다국어가 DB와 연동된 공통 인프라입니다. 좌측 메뉴에서 모듈을 선택하세요."
          : "Menu, roles, and i18n are wired to the database. Pick a module from the sidebar."}
      </Typography>

      <Grid container spacing={1.5}>
        {highlights.map((item) => (
          <Grid key={item.ko} size={{ xs: 12, sm: 6, md: 3 }}>
            <Box
              sx={{
                px: 2,
                py: 1.5,
                borderRadius: `${hisColors.radiusMd}px`,
                border: `1px solid ${hisColors.line}`,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(244,248,252,0.95) 100%)",
                boxShadow: hisColors.shadowSm,
              }}
            >
              <Typography sx={{ fontWeight: 800, color: hisColors.primaryDark, fontSize: 14 }}>
                {locale === "ko" ? item.ko : item.en}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

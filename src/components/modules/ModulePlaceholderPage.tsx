"use client";

import { Box, Chip, Stack, Typography } from "@mui/material";
import { useLocale } from "@/context/LocaleContext";
import { hisColors } from "@/theme/hisColors";

type ModulePlaceholderPageProps = {
  titleKo: string;
  titleEn: string;
  descriptionKo: string;
  descriptionEn: string;
  moduleCode: string;
};

export default function ModulePlaceholderPage({
  titleKo,
  titleEn,
  descriptionKo,
  descriptionEn,
  moduleCode,
}: ModulePlaceholderPageProps) {
  const { locale } = useLocale();

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 2 }}>
        <Chip
          label={moduleCode}
          size="small"
          sx={{
            fontWeight: 800,
            bgcolor: "rgba(11, 91, 143, 0.1)",
            color: hisColors.primaryDark,
            border: "1px solid rgba(11, 91, 143, 0.2)",
          }}
        />
        <Typography variant="caption" sx={{ color: hisColors.muted, fontWeight: 600 }}>
          {locale === "ko" ? "라우트 연결 완료 · 화면 구현 예정" : "Route wired · screen TBD"}
        </Typography>
      </Stack>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: hisColors.navy,
          mb: 1.5,
        }}
      >
        {locale === "ko" ? titleKo : titleEn}
      </Typography>
      <Typography sx={{ color: hisColors.muted, maxWidth: 720, lineHeight: 1.7, fontSize: 15 }}>
        {locale === "ko" ? descriptionKo : descriptionEn}
      </Typography>
    </Box>
  );
}

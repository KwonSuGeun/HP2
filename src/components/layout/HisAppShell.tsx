"use client";

import { Box, Typography } from "@mui/material";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import CommonMenuSidebar from "@/components/layout/CommonMenuSidebar";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";
import { useLocale } from "@/context/LocaleContext";
import { hisColors } from "@/theme/hisColors";

type HisAppShellProps = {
  children: React.ReactNode;
  userId?: number;
};

export default function HisAppShell({ children, userId = 1 }: HisAppShellProps) {
  const { locale } = useLocale();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CommonMenuSidebar userId={userId} width={252} locale={locale} />
      <Box component="main" sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Box
          component="header"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            px: { xs: 2, md: 3 },
            py: 1.5,
            minHeight: 64,
            borderBottom: `1px solid ${hisColors.line}`,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 100%)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 1px 0 rgba(255,255,255,0.8) inset",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                background: `linear-gradient(135deg, ${hisColors.primary} 0%, ${hisColors.primaryDark} 100%)`,
                boxShadow: `0 6px 16px ${hisColors.primaryGlow}`,
              }}
            >
              <LocalHospitalOutlinedIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 15,
                  lineHeight: 1.2,
                  color: hisColors.navy,
                  letterSpacing: "-0.02em",
                }}
                noWrap
              >
                {locale === "ko" ? "병원 정보 시스템" : "Hospital Information System"}
              </Typography>
              <Typography variant="caption" sx={{ color: hisColors.muted, fontWeight: 600 }}>
                HIS Common · {locale === "ko" ? "공통 도메인" : "Common Domain"}
              </Typography>
            </Box>
          </Box>
          <LocaleSwitcher />
        </Box>

        <Box
          sx={{
            flex: 1,
            px: { xs: 2, md: 3 },
            py: { xs: 2, md: 3 },
            pb: 4,
          }}
        >
          <Box
            sx={{
              borderRadius: `${hisColors.radiusLg}px`,
              border: `1px solid ${hisColors.line}`,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.94) 100%)",
              boxShadow: hisColors.shadowMd,
              p: { xs: 2.5, md: 3.5 },
              minHeight: "calc(100vh - 120px)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background:
                  `linear-gradient(90deg, ${hisColors.primary} 0%, ${hisColors.primaryLight} 50%, rgba(61,143,196,0.4) 100%)`,
              },
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

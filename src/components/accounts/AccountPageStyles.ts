import type { SxProps, Theme } from "@mui/material";

export const pageTitleSx: SxProps<Theme> = {
  fontWeight: 800,
  fontSize: 24,
  color: "var(--ink)",
};

export const registerButtonSx: SxProps<Theme> = {
  bgcolor: "var(--brand)",
  color: "#fff",
  px: 2.5,
  py: 1,
  "&:hover": { bgcolor: "var(--brand-strong)" },
};

export const searchButtonSx: SxProps<Theme> = {
  bgcolor: "var(--brand)",
  color: "#fff",
  minWidth: 72,
  "&:hover": { bgcolor: "var(--brand-strong)" },
};

export const resetLinkSx: SxProps<Theme> = {
  fontSize: 13,
  color: "var(--muted)",
  cursor: "pointer",
  textDecoration: "underline",
  "&:hover": { color: "var(--brand)" },
};

export const detailFilterToggleSx: SxProps<Theme> = {
  fontSize: 13,
  color: "var(--brand)",
  cursor: "pointer",
  fontWeight: 600,
  "&:hover": { textDecoration: "underline" },
};

export const tableHeadCellSx: SxProps<Theme> = {
  fontWeight: 700,
  fontSize: 13,
  color: "var(--muted)",
  bgcolor: "var(--panel-soft)",
  borderBottom: "1px solid var(--line)",
  py: 1.5,
};

export const tableBodyCellSx: SxProps<Theme> = {
  fontSize: 14,
  borderBottom: "1px solid rgba(217, 227, 238, 0.6)",
  py: 1.5,
};

export const tableRowEvenSx: SxProps<Theme> = {
  bgcolor: "rgba(246, 249, 252, 0.6)",
};

export const statusBadgeSx = (status: "ACTIVE" | "LEAVE" | "RETIRED"): SxProps<Theme> => {
  const colors = {
    ACTIVE: { bg: "rgba(11, 91, 143, 0.12)", color: "var(--brand)" },
    LEAVE: { bg: "rgba(217, 119, 6, 0.14)", color: "#b45309" },
    RETIRED: { bg: "rgba(107, 114, 128, 0.14)", color: "#6b7280" },
  };
  const { bg, color } = colors[status];
  return {
    display: "inline-block",
    px: 1.5,
    py: 0.4,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    bgcolor: bg,
    color,
  };
};

export const modalTitleSx: SxProps<Theme> = {
  fontWeight: 800,
  fontSize: 18,
};

export const formLabelSx: SxProps<Theme> = {
  fontSize: 12,
  fontWeight: 600,
  color: "var(--muted)",
  mb: 0.5,
};

export const formFieldHintSx: SxProps<Theme> = {
  fontSize: 11,
  color: "var(--muted)",
  mt: 0.25,
};

export const profileAvatarSx: SxProps<Theme> = {
  width: 112,
  height: 112,
  bgcolor: "#e5e7eb",
  color: "#9ca3af",
};

export const uploadButtonSx: SxProps<Theme> = {
  borderColor: "var(--line)",
  color: "var(--ink)",
  fontSize: 13,
};

export const modalCancelButtonSx: SxProps<Theme> = {
  borderColor: "var(--line)",
  color: "var(--ink)",
  minWidth: 88,
};

export const modalSubmitButtonSx: SxProps<Theme> = {
  bgcolor: "var(--brand)",
  color: "#fff",
  minWidth: 110,
  "&:hover": { bgcolor: "var(--brand-strong)" },
};

export const zipFindButtonSx: SxProps<Theme> = {
  borderColor: "var(--line)",
  color: "var(--brand)",
  fontSize: 13,
  whiteSpace: "nowrap",
};

export const nameLinkSx: SxProps<Theme> = {
  fontWeight: 600,
  color: "var(--brand)",
  cursor: "pointer",
  "&:hover": { textDecoration: "underline" },
};

export const detailSectionTitleSx: SxProps<Theme> = {
  fontWeight: 800,
  fontSize: 14,
  color: "var(--brand-strong)",
  mb: 1.5,
};

export const detailFieldLabelSx: SxProps<Theme> = {
  fontSize: 12,
  fontWeight: 600,
  color: "var(--muted)",
  mb: 0.25,
};

export const detailFieldValueSx: SxProps<Theme> = {
  fontSize: 14,
  color: "var(--ink)",
};

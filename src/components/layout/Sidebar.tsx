"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  CircularProgress,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ListIcon from "@mui/icons-material/List";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PolicyIcon from "@mui/icons-material/Policy";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import type { MenuNode } from "@/types/menu";
import { normalizeMenuPath } from "@/lib/navigation/menuPath";
import { hisColors } from "@/theme/hisColors";

const iconMap: Record<string, React.ReactNode> = {
  Home: <HomeRoundedIcon fontSize="small" />,
  People: <PersonRoundedIcon fontSize="small" />,
  MedicalServices: <LocalHospitalOutlinedIcon fontSize="small" />,
  Description: <DescriptionOutlinedIcon fontSize="small" />,
  FactCheck: <AssignmentTurnedInOutlinedIcon fontSize="small" />,
  List: <ListIcon fontSize="small" />,
  PersonAdd: <PersonAddIcon fontSize="small" />,
  Policy: <PolicyIcon fontSize="small" />,
  TaskAlt: <TaskAltIcon fontSize="small" />,
};

const HIDDEN_MENU_CODES = new Set([
  "STAFF_ROOT",
  "STAFF_DIRECTORY",
  "STAFF_PERMISSION_MANAGE",
  "BOARD",
  "BOARD_NOTICE",
  "BOARD_WORK",
  "BOARD_FREE",
]);
const MAX_MENU_DEPTH = 12;

const stripHiddenMenus = (
  menus: MenuNode[],
  depth = 0,
  ancestorIds: Set<number> = new Set()
): MenuNode[] =>
  menus
    .filter((menu) => !HIDDEN_MENU_CODES.has(menu.code))
    .map((menu) => {
      const hasKnownId = Number.isFinite(menu.id) && menu.id > 0;
      const nextAncestors = new Set(ancestorIds);
      if (hasKnownId) {
        nextAncestors.add(menu.id);
      }

      const canDescend = depth < MAX_MENU_DEPTH && (!hasKnownId || !ancestorIds.has(menu.id));
      return {
        ...menu,
        children: canDescend ? stripHiddenMenus(menu.children ?? [], depth + 1, nextAncestors) : [],
      };
    });

type SidebarProps = {
  menus: MenuNode[];
  width?: number;
  loading?: boolean;
  menuLoadError?: boolean;
  locale?: "ko" | "en";
};

export default function Sidebar({
  menus: initialMenus,
  width = 240,
  loading = false,
  menuLoadError = false,
  locale = "ko",
}: SidebarProps) {
  const pathname = usePathname();
  const [openMap, setOpenMap] = React.useState<Record<number, boolean>>({});
  const menus = React.useMemo(() => stripHiddenMenus(initialMenus), [initialMenus]);

  const itemSx = {
    borderRadius: "10px",
    mb: 0.5,
    px: 1.5,
    py: 1,
    color: hisColors.text,
    justifyContent: "flex-start",
    transition: "background-color 0.18s ease, box-shadow 0.18s ease",
    "&:hover": {
      bgcolor: "rgba(11, 91, 143, 0.09)",
      boxShadow: `inset 3px 0 0 ${hisColors.primaryLight}`,
    },
    "& .MuiListItemIcon-root": { color: hisColors.primary, minWidth: 36 },
  } as const;

  const isPathActive = React.useCallback(
    (path?: string | null, allowPrefix?: boolean) =>
      !!path &&
      (pathname === normalizeMenuPath(path) ||
        (allowPrefix && pathname.startsWith(`${normalizeMenuPath(path)}/`))),
    [pathname]
  );

  const isNodeActive = React.useCallback(
    (node: MenuNode) => isPathActive(node.path, !!node.children?.length),
    [isPathActive]
  );

  React.useEffect(() => {
    if (!menus.length) {
      return;
    }
    const nextOpen: Record<number, boolean> = {};
    const markParents = (
      nodes: MenuNode[],
      parents: number[] = [],
      depth = 0,
      ancestorIds: Set<number> = new Set()
    ) => {
      if (depth > MAX_MENU_DEPTH) {
        return;
      }

      for (const node of nodes) {
        const hasKnownId = Number.isFinite(node.id) && node.id > 0;
        if (hasKnownId && ancestorIds.has(node.id)) {
          continue;
        }

        const isActive = isNodeActive(node);
        if (isActive) {
          for (const parentId of parents) {
            nextOpen[parentId] = true;
          }
        }
        if (node.children?.length) {
          const nextAncestors = new Set(ancestorIds);
          if (hasKnownId) {
            nextAncestors.add(node.id);
          }
          markParents(node.children, [...parents, node.id], depth + 1, nextAncestors);
        }
      }
    };
    markParents(menus);
    setOpenMap((prev) => ({ ...prev, ...nextOpen }));
  }, [isNodeActive, menus, pathname]);

  const hasActiveChild = (
    node: MenuNode,
    depth = 0,
    ancestorIds: Set<number> = new Set()
  ): boolean => {
    if (depth > MAX_MENU_DEPTH) {
      return false;
    }

    const hasKnownId = Number.isFinite(node.id) && node.id > 0;
    if (hasKnownId && ancestorIds.has(node.id)) {
      return false;
    }

    const nextAncestors = new Set(ancestorIds);
    if (hasKnownId) {
      nextAncestors.add(node.id);
    }

    return node.children?.some(
      (child) => isNodeActive(child) || hasActiveChild(child, depth + 1, nextAncestors)
    ) ?? false;
  };

  const toggle = (id: number) => {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNode = (
    node: MenuNode,
    depth: number,
    ancestorIds: Set<number> = new Set()
  ): React.ReactNode => {
    if (depth > MAX_MENU_DEPTH) {
      return null;
    }

    const hasKnownId = Number.isFinite(node.id) && node.id > 0;
    if (hasKnownId && ancestorIds.has(node.id)) {
      return null;
    }

    const nextAncestors = new Set(ancestorIds);
    if (hasKnownId) {
      nextAncestors.add(node.id);
    }

    const hasChildren = !!node.children?.length;
    const isActive = isNodeActive(node);
    const isGroupActive = hasChildren && hasActiveChild(node, depth, ancestorIds);
    const isOpen = !!openMap[node.id];
    const isLeafNoPath = !node.path && !hasChildren;
    const paddingLeft = 1.5 + depth * 2;
    const menuLabel = locale === "en" ? node.nameEn ?? node.name : node.name;

    const icon =
      depth === 0 && node.icon && iconMap[node.icon]
        ? iconMap[node.icon]
        : depth > 0
        ? <FiberManualRecordIcon sx={{ fontSize: 8 }} />
        : null;

    const content = (
      <>
        <ListItemIcon
          sx={{
            minWidth: depth === 0 ? 36 : 26,
            mr: 1,
            justifyContent: "center",
            color: depth === 0 ? hisColors.primary : "rgba(43,58,69,0.60)",
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={menuLabel}
          primaryTypographyProps={{
            fontWeight: isActive || isGroupActive ? 800 : depth === 0 ? 700 : 600,
            fontSize: depth === 0 ? 14 : 13,
            noWrap: true,
          }}
        />
        {hasChildren ? (isOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />) : null}
      </>
    );

    const commonButtonSx = {
      ...itemSx,
      pl: paddingLeft,
      py: depth === 0 ? 1 : 0.75,
      mb: depth === 0 ? 0.75 : 0.5,
      opacity: isLeafNoPath ? 0.6 : 1,
      minHeight: depth === 0 ? 44 : 36,
      "&.Mui-selected": {
        bgcolor: "rgba(11, 91, 143, 0.14)",
        boxShadow: `inset 4px 0 0 ${hisColors.primary}`,
        "&:hover": {
          bgcolor: "rgba(11, 91, 143, 0.16)",
        },
      },
    };

    const groupButton = (
      <ListItemButton
        onClick={() => {
          if (hasChildren) {
            toggle(node.id);
          }
        }}
        disabled={isLeafNoPath}
        selected={isActive || isGroupActive}
        sx={commonButtonSx}
      >
        {content}
      </ListItemButton>
    );

    return (
      <React.Fragment key={node.id}>
        {node.path && !hasChildren ? (
          <ListItemButton
            component={Link}
            href={normalizeMenuPath(node.path) ?? "#"}
            selected={isActive}
            sx={commonButtonSx}
          >
            {content}
          </ListItemButton>
        ) : (
          groupButton
        )}
        {hasChildren ? (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List disablePadding>{node.children.map((child) => renderNode(child, depth + 1, nextAncestors))}</List>
          </Collapse>
        ) : null}
      </React.Fragment>
    );
  };

  return (
    <Box
      component="aside"
      sx={{
        display: "flex",
        flexDirection: "column",
        px: 1.5,
        py: 2,
        width,
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
        bgcolor: "rgba(255,255,255,0.88)",
        borderRight: `1px solid ${hisColors.line}`,
        boxShadow: hisColors.shadowSidebar,
        backdropFilter: "blur(14px)",
        backgroundImage:
          "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(244,248,252,0.92) 100%)",
      }}
    >
      <Box
        sx={{
          mx: 0.5,
          mb: 2,
          px: 1.5,
          py: 1.25,
          borderRadius: `${hisColors.radiusMd}px`,
          background:
            "linear-gradient(135deg, rgba(11,91,143,0.12) 0%, rgba(61,143,196,0.06) 100%)",
          border: "1px solid rgba(11, 91, 143, 0.12)",
        }}
      >
        <Typography
          variant="overline"
          sx={{ color: hisColors.primary, letterSpacing: 1.2, fontWeight: 800, lineHeight: 1.4 }}
        >
          HOSPITAL CORE
        </Typography>
        <Typography sx={{ fontWeight: 800, fontSize: 15, color: hisColors.navy, mt: 0.25 }}>
          {locale === "ko" ? "병원 운영 메뉴" : "Hospital Menus"}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", pr: 0.5 }}>
        {loading ? (
          <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
            <CircularProgress size={24} />
          </Box>
        ) : menuLoadError ? (
          <Box sx={{ px: 1, py: 1.5 }}>
            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
              {locale === "ko"
                ? "메뉴를 받아오는데 실패했습니다."
                : "Failed to load menus."}
            </Typography>
          </Box>
        ) : menus.length === 0 ? (
          <Box sx={{ px: 1, py: 1.5 }}>
            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
              {locale === "ko" ? "표시할 메뉴가 없습니다." : "No menus to display."}
            </Typography>
          </Box>
        ) : (
          <List disablePadding>{menus.map((node) => renderNode(node, 0))}</List>
        )}
      </Box>

      <Box sx={{ mt: "auto", pt: 2 }}>
        <Box
          sx={{
            p: 1.25,
            borderRadius: `${hisColors.radiusMd}px`,
            bgcolor: hisColors.surfaceMuted,
            border: "1px dashed rgba(11, 91, 143, 0.2)",
          }}
        >
          <Typography variant="caption" fontWeight={700} sx={{ color: hisColors.muted }}>
            {locale === "ko" ? "모듈 확장 · Sprint 진행" : "Module expansion · Next sprint"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

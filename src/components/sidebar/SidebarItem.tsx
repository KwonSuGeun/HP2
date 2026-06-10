"use client";

import Link from "next/link";
import type { SidebarItem as SidebarItemType } from "@/features/sidebar/SidebarTypes";
import { sidebarIconMap } from "./SidebarIcons";
import { hasActiveChild, isItemActive } from "./SidebarUtils";
import {
  getItemButtonClass,
  getItemIconClass,
  getItemLabelClass,
  getItemPaddingLeft,
} from "./sidebarItemUtils";
import styles from "./SidebarItem.module.css";

type SidebarItemProps = {
  item: SidebarItemType;
  pathname: string;
  depth?: number;
  openIds: number[];
  onToggle: (id: number) => void;
};

export default function SidebarItem({
  item,
  pathname,
  depth = 0,
  openIds,
  onToggle,
}: SidebarItemProps) {
  const hasChildren = !!item.children?.length;
  const isOpen = openIds.includes(item.id);
  const isActive = isItemActive(pathname, item.path, hasChildren);
  const isGroupActive = hasChildren && hasActiveChild(pathname, item);
  const isLeafNoPath = !item.path && !hasChildren;

  const icon =
    depth === 0 && item.icon && sidebarIconMap[item.icon] ? (
      sidebarIconMap[item.icon]
    ) : depth > 0 ? (
      <span className={styles.childDot} aria-hidden="true">
        •
      </span>
    ) : null;

  const buttonClass = getItemButtonClass(depth, isActive, isGroupActive, isLeafNoPath);
  const buttonStyle = { paddingLeft: getItemPaddingLeft(depth) };

  const content = (
    <>
      <span className={getItemIconClass(depth)}>{icon}</span>
      <span className={getItemLabelClass(depth, isActive, isGroupActive)}>{item.name}</span>
      {hasChildren ? (
        <span className={styles.expandIcon} aria-hidden="true">
          {isOpen ? "▴" : "▾"}
        </span>
      ) : null}
    </>
  );

  return (
    <li>
      {item.path && !hasChildren ? (
        <Link href={item.path} className={buttonClass} style={buttonStyle}>
          {content}
        </Link>
      ) : (
        <button
          type="button"
          className={buttonClass}
          style={buttonStyle}
          onClick={() => hasChildren && onToggle(item.id)}
          disabled={isLeafNoPath}
        >
          {content}
        </button>
      )}

      {hasChildren && isOpen ? (
        <ul className={styles.menuList}>
          {item.children.map((child) => (
            <SidebarItem
              key={child.id}
              item={child}
              pathname={pathname}
              depth={depth + 1}
              openIds={openIds}
              onToggle={onToggle}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

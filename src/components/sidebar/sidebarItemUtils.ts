import styles from "./SidebarItem.module.css";

export const getItemButtonClass = (
  depth: number,
  isActive: boolean,
  isGroupActive: boolean,
  isLeafNoPath: boolean,
) => {
  const depthClass =
    depth === 0
      ? styles.itemButtonDepth0
      : depth === 1
        ? styles.itemButtonDepth1
        : depth === 2
          ? styles.itemButtonDepth2
          : styles.itemButtonDepth3;

  return [
    styles.itemButton,
    depthClass,
    isActive || isGroupActive ? styles.itemButtonActive : "",
    isLeafNoPath ? styles.itemButtonDisabled : "",
  ]
    .filter(Boolean)
    .join(" ");
};

export const getItemIconClass = (depth: number) =>
  depth === 0 ? `${styles.itemIcon} ${styles.itemIconDepth0}` : `${styles.itemIcon} ${styles.itemIconDepth1}`;

export const getItemLabelClass = (depth: number, isActive: boolean, isGroupActive: boolean) => {
  const depthClass = depth === 0 ? styles.itemLabelDepth0 : styles.itemLabelDepth1;
  return [styles.itemLabel, depthClass, isActive || isGroupActive ? styles.itemLabelActive : ""]
    .filter(Boolean)
    .join(" ");
};

export const getItemPaddingLeft = (depth: number) => `${12 + depth * 16}px`;

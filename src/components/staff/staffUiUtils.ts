import type { Staff } from "@/features/staff/StaffTypes";
import styles from "./StaffPageStyles.module.css";

export const getStatusBadgeClass = (status: Staff["status"]) => {
  if (status === "ACTIVE") return `${styles.statusBadge} ${styles.statusActive}`;
  if (status === "LEAVE") return `${styles.statusBadge} ${styles.statusLeave}`;
  return `${styles.statusBadge} ${styles.statusRetired}`;
};
